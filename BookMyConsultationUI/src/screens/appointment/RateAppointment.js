import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, makeStyles, Radio, RadioGroup, FormControlLabel } from "@material-ui/core";
import axios from "../../util/fetch";
import Topbar from "../../common/Topbar"; // Import Topbar
import AppointmentsTable from "./AppointmentsTable";

const useStyles = makeStyles(() => ({
  container: {
    padding: "20px",
    maxWidth: "600px",
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
  tableContainer: {
    marginTop: "20px",
  },
}));

const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const RateAppointment = ({ baseUrl }) => {
  const classes = useStyles();
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [rating, setRating] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) {
          console.error("No access token found.");
          return;
        }

        const decodedToken = decodeToken(token);
        const userId = decodedToken?.aud;

        if (!userId) {
          console.error("Failed to extract userId from token.");
          return;
        }

        const response = await axios.get(`${baseUrl}/appointments/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Appointments fetched:", response.data);
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [baseUrl]);

  const handleRateAppointment = async () => {
    if (!selectedAppointmentId) {
      alert("Please select an appointment to rate.");
      return;
    }

    try {
      const token = sessionStorage.getItem("accessToken");
      await axios.post(
        `${baseUrl}/appointments/${selectedAppointmentId}/rate`,
        { rating, feedback },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Appointment rated successfully!");
    } catch (error) {
      console.error("Error rating appointment:", error);
      alert("Failed to rate appointment. Please try again.");
    }
  };

  return (
    <div>
      <Topbar /> {/* Add Topbar */}
      <div className={classes.container}>
        <Typography className={classes.title}>Rate Appointment</Typography>
        <div className={classes.tableContainer}>
          <Typography variant="h6">Select an Appointment to Rate</Typography>
          <RadioGroup
            value={selectedAppointmentId}
            onChange={(e) => setSelectedAppointmentId(e.target.value)}
          >
            {appointments.map((appointment) => (
              <FormControlLabel
                key={appointment.appointmentId}
                value={appointment.appointmentId}
                control={<Radio />}
                label={`Appointment ID: ${appointment.appointmentId}, Date: ${appointment.appointmentDate}, Time: ${appointment.timeSlot}`}
              />
            ))}
          </RadioGroup>
        </div>
        <TextField
          label="Rating (1-5)"
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Feedback"
          type="text"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={handleRateAppointment}
        >
          Submit Rating
        </Button>
      </div>
    </div>
  );
};

export default RateAppointment;