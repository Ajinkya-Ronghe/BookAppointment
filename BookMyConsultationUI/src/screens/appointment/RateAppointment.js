import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  makeStyles,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import axios from "../../util/fetch";

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
  error: {
    color: "red",
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
  },
}));

const RateAppointment = ({ open, onClose, appointment, baseUrl }) => {
  const classes = useStyles();
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!rating) {
      setError("Submit a rating");
      return;
    }
    setSubmitting(true);
    try {
      const token = sessionStorage.getItem("accessToken");
      await axios.post(
        `${baseUrl}/ratings`,
        {
          appointmentId: appointment.appointmentId,
          doctorId: appointment.doctorId,
          rating,
          comments,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSubmitting(false);
      onClose(true);
    } catch (err) {
      setSubmitting(false);
      setError("Failed to submit rating. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="xs" fullWidth>
      <DialogTitle disableTypography className={classes.dialogHeader}>
        Rate an Appointment
      </DialogTitle>
      <DialogContent className={classes.content}>
        <Typography variant="h6" style={{ marginBottom: 16 }}>
          {appointment?.doctorName}
        </Typography>
        <Rating
          name="appointment-rating"
          value={rating}
          onChange={(_, newValue) => setRating(newValue)}
          style={{ marginBottom: 16 }}
        />
        <TextField
          label="Comments"
          value={comments}
          onChange={e => setComments(e.target.value)}
          className={classes.field}
          variant="outlined"
          multiline
          rows={2}
        />
        {error && <div className={classes.error}>{error}</div>}
      </DialogContent>
      <DialogActions style={{ justifyContent: "center", paddingBottom: 16 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={submitting}
          style={{ background: '#1976d2', color: '#fff', textTransform: 'none' }}
        >
          Rate Appointment
        </Button>
        <Button
          variant="outlined"
          onClick={() => onClose(false)}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RateAppointment;