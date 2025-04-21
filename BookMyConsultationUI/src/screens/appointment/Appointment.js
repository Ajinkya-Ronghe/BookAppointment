import React, { useEffect, useState } from "react";
import { Typography, Paper, Button, Box } from "@material-ui/core";
import axios from "../../util/fetch";

const baseUrl = "http://localhost:8080";

const Appointment = ({ setRateModalOpen, setSelectedAppointment }) => {
  const [appointments, setAppointments] = useState([]);
  const isLoggedIn = !!sessionStorage.getItem("accessToken");

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchAppointments = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
            .join("")
        );
        const userId = JSON.parse(jsonPayload)?.aud;
        if (!userId) return;
        const response = await axios.get(`${baseUrl}/appointments/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(response.data);
      } catch (error) {
        setAppointments([]);
      }
    };
    fetchAppointments();
  }, [isLoggedIn]);

  // Fetch appointments again when the component is clicked (tab is selected)
  const handleRefresh = async () => {
    if (!isLoggedIn) return;
    try {
      const token = sessionStorage.getItem("accessToken");
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join("")
      );
      const userId = JSON.parse(jsonPayload)?.aud;
      if (!userId) return;
      const response = await axios.get(`${baseUrl}/appointments/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(response.data);
    } catch (error) {
      setAppointments([]);
    }
  };

  if (!isLoggedIn) {
    return (
      <Typography style={{ color: "#000", fontSize: 20, textAlign: "center", background: "transparent", marginTop: 24 }}>
        Login to see appointments
      </Typography>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <Typography style={{ color: "#000", fontSize: 20, textAlign: "center", background: "transparent", marginTop: 24 }}>
        No appointments found.
      </Typography>
    );
  }

  return (
    <Box style={{ width: '100%' }} onClick={handleRefresh}>
      {appointments.map((appointment) => (
        <Paper key={appointment.appointmentId} elevation={2} style={{ width: '100%', margin: 15, padding: 20, cursor: 'pointer', textAlign: 'left', borderRadius: 12 }}>
          <Typography variant="h6" style={{ fontWeight: 600, fontSize: 22, marginBottom: 8 }}>
            {appointment.doctorName}
          </Typography>
          <Typography style={{ marginBottom: 6 }}><b>Date:</b> {appointment.appointmentDate}</Typography>
          <Typography style={{ marginBottom: 6 }}><b>Symptoms:</b> {appointment.symptoms || 'N/A'}</Typography>
          <Typography style={{ marginBottom: 6 }}><b>Prior Medical History:</b> {appointment.priorMedicalHistory || 'N/A'}</Typography>
          {appointment.status === 'CONFIRMED' && (
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: 12, background: '#1976d2', color: '#fff', textTransform: 'none' }}
              onClick={() => {
                setSelectedAppointment(appointment);
                setRateModalOpen(true);
              }}
            >
              Rate Appointment
            </Button>
          )}
        </Paper>
      ))}
    </Box>
  );
};

export default Appointment;