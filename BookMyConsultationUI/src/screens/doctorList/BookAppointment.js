import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  makeStyles,
} from "@material-ui/core";
import axios from "../../util/fetch";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles(() => ({
  dialogHeader: {
    background: "purple",
    height: 70,
    padding: 11,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    fontWeight: 600,
    fontSize: 20,
  },
  content: {
    padding: 20,
    textAlign: "left",
  },
  field: {
    marginBottom: 15,
    width: "100%",
  },
  button: {
    width: "40%",
    margin: 10,
    textTransform: "none",
  },
  error: {
    color: "red",
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
  },
}));

const timeSlots = [
  "09:00 AM", "09:15 AM", "09:30 AM", "09:45 AM", "10:00 AM", "10:15 AM", "10:30 AM", "10:45 AM",
  "11:00 AM", "11:15 AM", "11:30 AM", "11:45 AM", "12:00 PM", "12:15 PM", "12:30 PM", "12:45 PM",
  "01:00 PM", "01:15 PM", "01:30 PM", "01:45 PM", "02:00 PM", "02:15 PM", "02:30 PM", "02:45 PM",
  "03:00 PM", "03:15 PM", "03:30 PM", "03:45 PM", "04:00 PM", "04:15 PM", "04:30 PM", "04:45 PM", "05:00 PM"
];

const BookAppointment = ({ open, onClose, doctor, baseUrl }) => {
  const classes = useStyles();
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [error, setError] = useState("");
  const [slotError, setSlotError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  useEffect(() => {
    if (open) {
      setDate(new Date().toISOString().slice(0, 10));
      setSlot("");
      setMedicalHistory("");
      setSymptoms("");
      setError("");
      setSlotError("");
      setSubmitting(false);
      setShowErrorPopup(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    setError("");
    setSlotError("");
    if (!slot) {
      setSlotError("Select a time slot");
      return;
    }
    setSubmitting(true);
    try {
      const token = sessionStorage.getItem("accessToken");
      // Extract userId from token
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join("")
      );
      const userId = JSON.parse(jsonPayload)?.aud;
      const userEmailId = userId;
      const userName = userId ? userId.split("@")[0] : "";
      const doctorName = `Dr. ${doctor.firstName} ${doctor.lastName}`;
      const createdDate = new Date().toISOString().slice(0, 10);
      await axios.post(
        `${baseUrl}/appointments`,
        {
          doctorName,
          doctorId: doctor.id,
          appointmentDate: date,
          timeSlot: slot,
          priorMedicalHistory: medicalHistory,
          symptoms,
          status: "CONFIRMED",
          userId,
          userEmailId,
          userName,
          createdDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onClose(true);
      setSubmitting(false);
    } catch (err) {
      setSubmitting(false);
      if (err.response && err.response.status === 400) {
        setError("Either the slot is already booked or not available");
      } else {
        setError("Failed to book appointment. Please try again.");
      }
      setShowErrorPopup(true);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="xs" fullWidth>
      <DialogTitle disableTypography className={classes.dialogHeader}>
        Book an Appointment
      </DialogTitle>
      <DialogContent className={classes.content}>
        {showErrorPopup && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            background: 'rgba(0,0,0,0.2)'
          }}>
            <div style={{
              background: '#333',
              color: '#fff',
              borderRadius: 8,
              padding: '24px 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              minWidth: 320
            }}>
              <span>{error}</span>
              <Button
                variant="contained"
                size="small"
                style={{ marginLeft: 24, background: '#555', color: '#fff', textTransform: 'none' }}
                onClick={() => setShowErrorPopup(false)}
              >
                OK
              </Button>
            </div>
          </div>
        )}
        <TextField
          label="Doctor Name"
          value={`Dr. ${doctor.firstName} ${doctor.lastName}`}
          className={classes.field}
          InputProps={{ readOnly: true }}
          variant="outlined"
        />
        <TextField
          label="Appointment Date"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className={classes.field}
          InputLabelProps={{ shrink: true }}
          variant="outlined"
        />
        <FormControl variant="outlined" className={classes.field} error={!!slotError}>
          <InputLabel id="slot-label">Time Slot</InputLabel>
          <Select
            labelId="slot-label"
            value={slot}
            onChange={e => setSlot(e.target.value)}
            label="Time Slot"
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {timeSlots.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {slotError && <div className={classes.error}>{slotError}</div>}
        <TextField
          label="Medical History"
          value={medicalHistory}
          onChange={e => setMedicalHistory(e.target.value)}
          className={classes.field}
          variant="outlined"
          multiline
          rows={2}
        />
        <TextField
          label="Symptoms"
          value={symptoms}
          onChange={e => setSymptoms(e.target.value)}
          className={classes.field}
          variant="outlined"
          multiline
          rows={2}
        />
      </DialogContent>
      <DialogActions style={{ justifyContent: "center", paddingBottom: 16 }}>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={submitting}
        >
          Book Appointment
        </Button>
        <Button
          className={classes.button}
          variant="outlined"
          onClick={() => onClose(false)}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookAppointment;
