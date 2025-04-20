import React, { useState, useEffect } from "react";
import { Tabs, Tab, Typography, Box, Paper, Button } from "@material-ui/core";
import DoctorList from "../doctorList/DoctorList";
import axios from "../../util/fetch";
import Header from "../../common/header/Header";
import Appointment from "../appointment/Appointment";
import RateAppointment from "../appointment/RateAppointment";

const baseUrl = "http://localhost:8081";

const AppointmentTiles = ({ appointments, setLoginModalOpen }) => {
  if (!appointments || appointments.length === 0) {
    return <Typography style={{ color: "#000", fontSize: 20, textAlign: "center", background: "transparent" }}>No appointments found.</Typography>;
  }
  return appointments.map((appointment) => (
    <Box key={appointment.appointmentId} style={{
      width: '100%',
      background: '#fff',
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      marginBottom: 24,
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }}>
      <Typography variant="h6" style={{ fontWeight: 600, fontSize: 22 }}>
        {appointment.doctorName}
      </Typography>
      <Typography>Date: {appointment.appointmentDate}</Typography>
      <Typography>Symptoms: {appointment.symptoms || 'N/A'}</Typography>
      <Typography>Prior Medical History: {appointment.priorMedicalHistory || 'N/A'}</Typography>
      <Button
        variant="contained"
        color="primary"
        style={{ alignSelf: 'flex-end', background: '#1976d2', color: '#fff', textTransform: 'none', marginTop: 8 }}
        onClick={() => {
          if (!sessionStorage.getItem("accessToken")) {
            if (setLoginModalOpen) setLoginModalOpen(true);
            return;
          }
          window.location.href = `/appointments/rate?appointmentId=${appointment.appointmentId}`;
        }}
      >
        Rate Appointment
      </Button>
    </Box>
  ));
};

const Home = () => {
  const [tab, setTab] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const isLoggedIn = !!sessionStorage.getItem("accessToken");

  useEffect(() => {
    const fetchAppointments = async () => {
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
    fetchAppointments();
  }, [isLoggedIn]);

  const handleTabChange = (_, v) => {
    setTab(v);
    if (v === 1 && !isLoggedIn) {
      setLoginModalOpen(true);
    }
  };

  return (
    <Box style={{ maxWidth: 1200, margin: "80px auto 0 auto", padding: 20 }}>
      <Header forceLoginModal={loginModalOpen} setForceLoginModal={setLoginModalOpen} />
      <Paper square>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Doctors" />
          <Tab label="Appointments" />
        </Tabs>
      </Paper>
      <Box hidden={tab !== 0} style={{ marginTop: 24 }}>
        <DoctorList baseUrl={baseUrl} hideTitle hideSearch setLoginModalOpen={setLoginModalOpen} />
      </Box>
      <Box hidden={tab !== 1} style={{ marginTop: 24, background: "transparent", borderRadius: 8, padding: 0, minHeight: 200 }}>
        <Appointment setRateModalOpen={setRateModalOpen} setSelectedAppointment={setSelectedAppointment} />
        <RateAppointment
          open={rateModalOpen}
          onClose={() => setRateModalOpen(false)}
          appointment={selectedAppointment}
          baseUrl={baseUrl}
        />
      </Box>
    </Box>
  );
};

export default Home;