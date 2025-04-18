import React, { useState, useEffect } from "react";
import { Typography, TextField, Button, makeStyles } from "@material-ui/core";
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
    if (!selectedDoctor) {
      alert("Please select a doctor.");
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
      alert("Failed to book appointment. Please try again.");
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
        <TextField
          label="Time Slot"
          type="time"
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
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