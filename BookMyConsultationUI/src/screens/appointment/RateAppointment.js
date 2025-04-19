import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Radio,
  TextField,
  makeStyles,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import axios from "../../util/fetch";
import Topbar from "../../common/Topbar";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(() => ({
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "50px auto",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    marginTop: "80px",
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
  const history = useHistory();
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [rating, setRating] = useState(0);
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

        // Filter appointments with status CONFIRMED
        const confirmedAppointments = response.data.filter(
          (appointment) => appointment.status === "CONFIRMED"
        );

        // Sort appointments by Appointment ID in descending order
        const sortedAppointments = confirmedAppointments.sort(
          (a, b) => b.appointmentId - a.appointmentId
        );

        setAppointments(sortedAppointments);
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

    const selectedAppointment = appointments.find(
      (appointment) => appointment.appointmentId === selectedAppointmentId
    );

    if (!selectedAppointment) {
      alert("Selected appointment not found.");
      return;
    }

    const { doctorId } = selectedAppointment;

    const ratingData = {
      appointmentId: selectedAppointmentId,
      doctorId,
      rating,
      comments: feedback,
    };

    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        alert("You are not logged in. Please log in to rate the appointment.");
        return;
      }

      await axios.post(`${baseUrl}/ratings`, ratingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Appointment rated successfully!");

      // Redirect to Home Tab
     // history.push("/");
    } catch (error) {
      console.error("Error rating appointment:", error);
      alert("Failed to rate appointment. Please try again.");
    }
  };

  return (
    <div>
      <Topbar />
      <div className={classes.container}>
        <Typography className={classes.title}>Rate Appointment</Typography>
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Select</TableCell>
                <TableCell>Appointment ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time Slot</TableCell>
                <TableCell>Doctor Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.appointmentId}>
                  <TableCell>
                    <Radio
                      checked={selectedAppointmentId === appointment.appointmentId}
                      onChange={() => setSelectedAppointmentId(appointment.appointmentId)}
                      value={appointment.appointmentId}
                    />
                  </TableCell>
                  <TableCell>{appointment.appointmentId}</TableCell>
                  <TableCell>{appointment.appointmentDate}</TableCell>
                  <TableCell>{appointment.timeSlot}</TableCell>
                  <TableCell>{appointment.doctorName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="h6" gutterBottom>
          Rate the Appointment
        </Typography>
        <Rating
          name="appointment-rating"
          value={rating}
          onChange={(event, newValue) => setRating(newValue)}
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