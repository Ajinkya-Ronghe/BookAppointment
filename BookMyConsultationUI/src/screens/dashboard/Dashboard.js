import React, { useState, useEffect } from "react";
import { Tabs, Tab, Typography, Card, CardContent, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import axios from "../../util/fetch";
import AppointmentsTable from "../appointment/AppointmentsTable";
import BookAppointment from "../appointment/BookAppointment";
import DoctorList from "../doctorList/DoctorList";
import RateAppointment from "../appointment/RateAppointment";
import Header from "../../common/header/Header";

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
  tabContent: {
    marginTop: "20px",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
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
  const [activeTab, setActiveTab] = useState(0);
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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div>
      <Header />
      <div className={classes.container}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Home" />
          <Tab label="Book Appointment" />
          <Tab label="View Doctors" />
          <Tab label="Rate Appointment" />
        </Tabs>
        <div className={classes.tabContent}>
          {activeTab === 0 && (
            <div>
              <Typography className={classes.title}>Dashboard</Typography>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Your Appointments
                  </Typography>
                  <AppointmentsTable appointments={appointments} />
                </CardContent>
              </Card>
            </div>
          )}
          {activeTab === 1 && <BookAppointment baseUrl={baseUrl} />}
          {activeTab === 2 && <DoctorList baseUrl={baseUrl} />}
          {activeTab === 3 && <RateAppointment baseUrl={baseUrl} />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;