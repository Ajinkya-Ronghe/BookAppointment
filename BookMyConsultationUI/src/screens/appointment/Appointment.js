import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import axios from "../../util/fetch";
import AppointmentsTable from "./AppointmentsTable";

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

const Appointment = ({ baseUrl }) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        const decodedToken = decodeToken(token);
        const userId = decodedToken?.sub; // Assuming `sub` contains the userId

        if (!userId) {
          console.error("Failed to extract userId from token.");
          return;
        }

        // Use the correct endpoint to fetch appointments for the user
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

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Your Appointments
      </Typography>
      <AppointmentsTable appointments={appointments} />
    </div>
  );
};

export default Appointment;