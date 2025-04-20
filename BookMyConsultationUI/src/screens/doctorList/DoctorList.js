import React, { useEffect, useState } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  makeStyles,
} from "@material-ui/core";
import axios from "../../util/fetch";
import Header from "../../common/header/Header";
import BookAppointment from "./BookAppointment";
import DoctorDetails from "./DoctorDetails";

const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

const useStyles = makeStyles(() => ({
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "50px auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    marginTop: "80px",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },
  button: {
    marginBottom: "20px",
    textTransform: "none",
    backgroundColor: "#3f51b5",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#0056b3",
    },
  },
  filterContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
    gap: "20px",
  },
  clearButton: {
    width: "300px",
    marginBottom: "20px",
  },
  card: {
    marginBottom: "20px",
  },
  tableContainer: {
    marginTop: "20px",
  },
}));

const DoctorList = ({ baseUrl, hideTitle, hideSearch, setLoginModalOpen }) => {
  const classes = useStyles();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [speciality, setSpeciality] = useState("");
  const [search, setSearch] = useState("");
  const [specialities, setSpecialities] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [bookDoctor, setBookDoctor] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsDoctor, setDetailsDoctor] = useState(null);
  const [newDoctor, setNewDoctor] = useState({
    firstName: "",
    lastName: "",
    speciality: "",
    dob: "",
    mobile: "",
    emailId: "",
    pan: "",
    highestQualification: "",
    college: "",
    totalYearsOfExp: "",
    rating: "",
    addressLine1: "", // New field
    addressLine2: "", // New field
    city: "",         // New field
    postcode: "",     // New field
    state: "",        // New field
  });

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      const decodedToken = decodeToken(token);
      setIsAdmin(decodedToken?.role === "admin");
    }
  }, []);

  // Fetch all doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${baseUrl}/doctors`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        });
        setDoctors(response.data);
        setFilteredDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, [baseUrl]);

  // Fetch all specialities
  useEffect(() => {
    const fetchSpecialities = async () => {
      try {
        const response = await axios.get(`${baseUrl}/doctors/speciality`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        });
        setSpecialities(response.data);
      } catch (error) {
        console.error("Error fetching specialities:", error);
      }
    };

    fetchSpecialities();
  }, [baseUrl]);

  // Filter doctors based on speciality and search
  useEffect(() => {
    let filtered = doctors;

    if (speciality) {
      filtered = filtered.filter((doctor) => doctor.speciality === speciality);
    }

    if (search) {
      filtered = filtered.filter((doctor) => {
        const firstName = doctor.firstName || "";
        const lastName = doctor.lastName || "";
        const emailId = doctor.emailId || "";
        const mobile = doctor.mobile || "";
        const address = doctor.address || "";
        const dob = doctor.dob || "";
        const qualification = doctor.highestQualification || "";
        const experience = doctor.totalYearsOfExp ? doctor.totalYearsOfExp.toString() : "";
        const rating = doctor.rating ? doctor.rating.toString() : "";

        return (
          firstName.toLowerCase().includes(search.toLowerCase()) ||
          lastName.toLowerCase().includes(search.toLowerCase()) ||
          emailId.toLowerCase().includes(search.toLowerCase()) ||
          mobile.includes(search) ||
          address.toLowerCase().includes(search.toLowerCase()) ||
          dob.toLowerCase().includes(search.toLowerCase()) ||
          qualification.toLowerCase().includes(search.toLowerCase()) ||
          experience.includes(search) ||
          rating.includes(search)
        );
      });
    }

    setFilteredDoctors(filtered);
  }, [speciality, search, doctors]);

  const handleAddDoctor = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor({ ...newDoctor, [name]: value });
  };

  const handleSubmit = async () => {
    const token = sessionStorage.getItem("accessToken");
    try {
      await axios.post(`${baseUrl}/doctors`, newDoctor, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Doctor added successfully!");
      setOpen(false);
      // Refresh the doctor list
      const response = await axios.get(`${baseUrl}/doctors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDoctors(response.data);
    } catch (error) {
      console.error("Error adding doctor:", error);
      alert("Failed to add doctor. Please try again.");
    }
  };

  return (
    <div>
      <div className={classes.container}>
        {isAdmin && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <Button
              className={classes.button}
              variant="contained"
              onClick={handleAddDoctor}
            >
              Add Doctor
            </Button>
          </div>
        )}
        <div className={classes.filterContainer} style={{ justifyContent: 'center', gap: 0 }}>
          <TextField
            select
            label="Filter by Speciality"
            value={speciality}
            onChange={(e) => setSpeciality(e.target.value)}
            style={{ width: 340 }}
            margin="normal"
          >
            <MenuItem value="">All Specialities</MenuItem>
            {specialities.map((spec) => (
              <MenuItem key={spec} value={spec}>
                {spec}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
          {filteredDoctors.map((doctor) => (
            <Paper key={doctor.id} elevation={2} style={{ width: '40%', minWidth: 320, margin: 15, padding: 20, cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <Typography variant="h6" style={{ fontWeight: 600, fontSize: 20, marginRight: 8 }}>
                  Doctor Name:
                </Typography>
                <Typography variant="h5" style={{ fontWeight: 600, fontSize: 22 }}>
                  {doctor.firstName} {doctor.lastName}
                </Typography>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <Typography variant="subtitle1" style={{ marginRight: 8 }}>
                  Speciality:
                </Typography>
                <Typography variant="body1">{doctor.speciality}</Typography>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                <Typography variant="subtitle1" style={{ marginRight: 8 }}>
                  Rating:
                </Typography>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} style={{ color: i < Math.round(Number(doctor.rating)) ? '#FFD700' : '#ccc', fontSize: 20 }}>&#9733;</span>
                  ))}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ width: '40%', margin: 10, textTransform: 'none' }}
                  onClick={() => {
                    if (!sessionStorage.getItem("accessToken")) {
                      if (setLoginModalOpen) setLoginModalOpen(true);
                      return;
                    }
                    setBookDoctor(doctor);
                    setBookOpen(true);
                  }}
                >
                  Book Appointment
                </Button>
                <Button
                  variant="contained"
                  style={{ width: '40%', margin: 10, textTransform: 'none', backgroundColor: '#43a047', color: '#fff' }}
                  onClick={() => {
                    setDetailsDoctor(doctor);
                    setDetailsOpen(true);
                  }}
                >
                  View Details
                </Button>
              </div>
            </Paper>
          ))}
        </div>
        <BookAppointment
          open={bookOpen}
          onClose={() => setBookOpen(false)}
          doctor={bookDoctor || { firstName: '', lastName: '', id: '' }}
          baseUrl={baseUrl}
        />
        <DoctorDetails
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          doctor={detailsDoctor}
        />
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
          <DialogTitle disableTypography style={{
            background: 'purple',
            height: 70,
            padding: 11,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 600,
            fontSize: 20
          }}>
            Add Doctor
          </DialogTitle>
          <DialogContent style={{ padding: 20, textAlign: 'left' }}>
            <TextField
              label="First Name"
              name="firstName"
              value={newDoctor.firstName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={newDoctor.lastName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              select
              label="Speciality"
              name="speciality"
              value={newDoctor.speciality}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              {specialities.map((spec) => (
                <MenuItem key={spec} value={spec}>
                  {spec}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Date of Birth"
              name="dob"
              type="date"
              value={newDoctor.dob}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Mobile"
              name="mobile"
              value={newDoctor.mobile}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              name="emailId"
              value={newDoctor.emailId}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="PAN"
              name="pan"
              value={newDoctor.pan}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Qualification"
              name="highestQualification"
              value={newDoctor.highestQualification}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="College"
              name="college"
              value={newDoctor.college}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Experience (Years)"
              name="totalYearsOfExp"
              value={newDoctor.totalYearsOfExp}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Rating"
              name="rating"
              value={newDoctor.rating}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Address Line 1"
              name="addressLine1"
              value={newDoctor.addressLine1}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Address Line 2"
              name="addressLine2"
              value={newDoctor.addressLine2}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="City"
              name="city"
              value={newDoctor.city}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Postcode"
              name="postcode"
              value={newDoctor.postcode}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="State"
              name="state"
              value={newDoctor.state}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions style={{ justifyContent: 'center', paddingBottom: 16 }}>
            <Button onClick={handleClose} color="secondary" variant="outlined" style={{ margin: 10, width: '40%' }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary" variant="contained" style={{ margin: 10, width: '40%' }}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default DoctorList;