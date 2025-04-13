import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@material-ui/core";

const AppointmentsTable = ({ appointments }) => {
  if (!appointments || appointments.length === 0) {
    return <Typography>No appointments found.</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Appointment ID</TableCell>
            <TableCell>Appointment Date</TableCell>
            <TableCell>Doctor ID</TableCell>
            <TableCell>User ID</TableCell>
            <TableCell>Time Slot</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.appointmentId}>
              <TableCell>{appointment.appointmentId}</TableCell>
              <TableCell>{appointment.appointmentDate}</TableCell>
              <TableCell>{appointment.doctorId}</TableCell>
              <TableCell>{appointment.userId}</TableCell>
              <TableCell>{appointment.timeSlot}</TableCell>
              <TableCell>{appointment.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AppointmentsTable;