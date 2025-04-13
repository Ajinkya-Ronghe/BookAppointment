import React, { useState, useEffect } from "react";
import { Typography, Button, Card, CardContent, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import axios from "../../util/fetch";
import AppointmentsTable from "../appointment/AppointmentsTable";
import Topbar from "../../common/Topbar"; // Import Topbar
import "./Dashboard.css";

const useStyles = makeStyles(() => ({
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "50px auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    marginTop: "80px", // Add margin to account for the fixed Topbar
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "1rem",
    textTransform: "none",
  },
  card: {
    marginBottom: "20px",
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

const Dashboard = ({ baseUrl }) => {
  const classes = useStyles();
  const history = useHistory();
  const [appointments, setAppointments] = useState([]);

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

        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [baseUrl]);

  const navigateTo = (path) => {
    history.push(path);
  };

  return (
    <div>
      <Topbar /> {/* Add Topbar */}
      <div className={classes.container}>
        <Typography className={classes.title}>Dashboard</Typography>
        <div className={classes.buttonContainer}>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={() => navigateTo("/appointments/new")}
          >
            Book Appointment
          </Button>
          <Button
            className={classes.button}
            variant="contained"
            color="secondary"
            onClick={() => navigateTo("/doctors")}
          >
            View Doctors
          </Button>
          <Button
            className={classes.button}
            variant="contained"
            color="default"
            onClick={() => navigateTo("/appointments/rate")}
          >
            Rate Appointment
          </Button>
        </div>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Your Appointments
            </Typography>
            <AppointmentsTable appointments={appointments} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;