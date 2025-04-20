import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  makeStyles,
  Card,
  CardContent
} from "@material-ui/core";

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
  },
}));

const DoctorDetails = ({ open, onClose, doctor }) => {
  const classes = useStyles();
  if (!doctor) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle disableTypography className={classes.dialogHeader}>
        Doctor Details
      </DialogTitle>
      <DialogContent className={classes.content}>
        <Card elevation={0}>
          <CardContent>
            <Typography variant="h6" className={classes.field} style={{ fontWeight: 600, fontSize: 22 }}>
              Dr. {doctor.firstName} {doctor.lastName}
            </Typography>
            <Typography className={classes.field}><b>Total Experience:</b> {doctor.totalYearsOfExp || 'N/A'} years</Typography>
            <Typography className={classes.field}><b>Speciality:</b> {doctor.speciality}</Typography>
            <Typography className={classes.field}><b>Date of Birth:</b> {doctor.dob || 'N/A'}</Typography>
            <Typography className={classes.field}><b>City:</b> {doctor.city || 'N/A'}</Typography>
            <Typography className={classes.field}><b>Email:</b> {doctor.emailId || 'N/A'}</Typography>
            <Typography className={classes.field}><b>Mobile:</b> {doctor.mobile || 'N/A'}</Typography>
            <div className={classes.field} style={{ display: 'flex', alignItems: 'center' }}>
              <b>Rating:</b>
              <span style={{ marginLeft: 8 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} style={{ color: i < Math.round(Number(doctor.rating)) ? '#FFD700' : '#ccc', fontSize: 20 }}>&#9733;</span>
                ))}
              </span>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorDetails;