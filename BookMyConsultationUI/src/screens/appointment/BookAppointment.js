import React, { useState, useEffect } from "react";
import { Typography, TextField, Button, makeStyles, MenuItem, Select, FormControl, InputLabel } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "../../util/fetch";
import Topbar from "../../common/Topbar"; // Import Topbar
import { useHistory } from "react-router-dom"; // Import useHistory

const useStyles = makeStyles(() => ({
  container: {
    padding: "20px",
    maxWidth: "400px",
    margin: "50px auto",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    marginTop: "80px", // Add margin to account for the fixed Topbar
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "1rem",
    textTransform: "none",
  },
}));

const timeSlots = [
  "09:00 AM",
  "09:15 AM",
  "09:30 AM",
  "09:45 AM",
  "10:00 AM",
  "10:15 AM",
  "10:30 AM",
  "10:45 AM",
  "11:00 AM",
  "11:15 AM",
  "11:30 AM",
  "11:45 AM",
  "12:00 PM",
  "12:15 PM",
  "12:30 PM",
  "12:45 PM",
  "01:00 PM",
  "01:15 PM",
  "01:30 PM",
  "01:45 PM",
  "02:00 PM",
  "02:15 PM",
  "02:30 PM",
  "02:45 PM",
  "03:00 PM",
  "03:15 PM",
  "03:30 PM",
  "03:45 PM",
  "04:00 PM",
  "04:15 PM",
  "04:30 PM",
  "04:45 PM",
  "05:00 PM",
];

const menuProps = {
  PaperProps: {
    style: {
      maxHeight: 200, // Limit the height of the dropdown
      overflowY: "auto", // Add a scrollbar
    },
  },
};

const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1]; // Extract the payload part
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Replace Base64URL characters
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload); // Parse the JSON payload
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const BookAppointment = ({ baseUrl }) => {
  const classes = useStyles();
  const history = useHistory(); // Initialize useHistory
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [status, setStatus] = useState("CONFIRMED");
  const [priorMedicalHistory, setPriorMedicalHistory] = useState("");
  const [symptoms, setSymptoms] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${baseUrl}/doctors`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        });
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, [baseUrl]);

  const handleSubmit = async () => {
    // Check if a doctor is selected
    if (!selectedDoctor) {
      alert("Please select a doctor.");
      return;
    }
  
    // Check if the appointment date is provided
    if (!appointmentDate) {
      alert("Please select an appointment date.");
      return;
    }
  
    // Check if the time slot is provided
    if (!timeSlot) {
      alert("Please select a time slot.");
      return;
    }
  
    // Check if prior medical history is provided
    if (!priorMedicalHistory.trim()) {
      alert("Please provide prior medical history.");
      return;
    }
  
    // Check if symptoms are provided
    if (!symptoms.trim()) {
      alert("Please provide symptoms.");
      return;
    }
  
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      alert("No access token found. Please log in again.");
      return;
    }
  
    const decodedToken = decodeToken(token);
    const userId = decodedToken?.aud; // Extract userId from the 'aud' field
  
    if (!userId) {
      alert("Failed to extract user information. Please log in again.");
      return;
    }
  
    // Validate date and time
    const currentDate = new Date();
    const selectedDateTime = new Date(`${appointmentDate}T${timeSlot}`);
    if (selectedDateTime < currentDate) {
      alert("You cannot select a past date or time for the appointment.");
      return;
    }
  
    const appointmentData = {
      doctorId: selectedDoctor.id,
      doctorName: `${selectedDoctor.firstName} ${selectedDoctor.lastName}`,
      userId,
      userName: decodedToken?.name || "N/A", // Assuming the token contains the user's name
      appointmentDate,
      timeSlot,
      status,
      priorMedicalHistory,
      symptoms,
      createdDate: new Date().toISOString(), // Current date and time
    };
  
    try {
      await axios.post(`${baseUrl}/appointments`, appointmentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Appointment booked successfully!");
      history.push("/dashboard"); // Redirect to the dashboard
    } catch (error) {
      console.error("Error booking appointment:", error);
      // Check if the error message is "The selected slot is unavailable."
      if (error.response && error.response.status === 400) {
        if (error.response.data === "The selected slot is unavailable.") {
          alert("The selected slot is unavailable. Please choose a different time.");
        }
      } else {
        alert("Failed to book appointment. Please try again.");
      }
    }
  };

  return (
    <div>
      <Topbar /> {/* Add Topbar */}
      <div className={classes.container}>
        <Typography className={classes.title}>Book Appointment</Typography>
        <Autocomplete
          options={doctors}
          getOptionLabel={(doctor) => `${doctor.firstName} ${doctor.lastName} - ${doctor.speciality}`}
          value={selectedDoctor}
          onChange={(event, newValue) => setSelectedDoctor(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Doctor"
              variant="outlined"
              fullWidth
              margin="normal"
            />
          )}
        />
        <TextField
          label="Appointment Date"
          type="date"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="time-slot-label">Time Slot</InputLabel>
          <Select
            labelId="time-slot-label"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            MenuProps={menuProps}
          >
            {timeSlots.map((slot) => (
              <MenuItem key={slot} value={slot}>
                {slot}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Prior Medical History"
          value={priorMedicalHistory}
          onChange={(e) => setPriorMedicalHistory(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={3}
        />
        <TextField
          label="Symptoms"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={3}
        />
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Book Appointment
        </Button>
      </div>
    </div>
  );
};

export default BookAppointment;