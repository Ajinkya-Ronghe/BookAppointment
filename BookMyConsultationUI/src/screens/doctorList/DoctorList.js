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
import Topbar from "../../common/Topbar";

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

const DoctorList = ({ baseUrl }) => {
  const classes = useStyles();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [speciality, setSpeciality] = useState("");
  const [search, setSearch] = useState("");
  const [specialities, setSpecialities] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);
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
      <Topbar />
      <div className={classes.container}>
        {isAdmin && (
          <Button
            className={classes.button}
            variant="contained"
            onClick={handleAddDoctor}
          >
            Add Doctor
          </Button>
        )}
        <Typography className={classes.title}>Doctor List</Typography>
        <div className={classes.filterContainer}>
          <TextField
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="Search by any field (e.g., name, email, mobile, address, etc.)"
          />
          <TextField
            select
            label="Filter by Speciality"
            value={speciality}
            onChange={(e) => setSpeciality(e.target.value)}
            fullWidth
            margin="normal"
          >
            <MenuItem value="">All Specialities</MenuItem>
            {specialities.map((spec) => (
              <MenuItem key={spec} value={spec}>
                {spec}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setSpeciality("");
              setSearch("");
            }}
            className={classes.clearButton}
          >
            Clear Filters
          </Button>
        </div>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Doctors
            </Typography>
            <TableContainer component={Paper} className={classes.tableContainer}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>First Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>Speciality</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Mobile</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>DOB</TableCell>
                    <TableCell>Qualification</TableCell>
                    <TableCell>Experience (Years)</TableCell>
                    <TableCell>Rating</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDoctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell>{doctor.firstName || "N/A"}</TableCell>
                      <TableCell>{doctor.lastName || "N/A"}</TableCell>
                      <TableCell>{doctor.speciality || "N/A"}</TableCell>
                      <TableCell>{doctor.emailId || "N/A"}</TableCell>
                      <TableCell>{doctor.mobile || "N/A"}</TableCell>
                      <TableCell>{`${doctor.addressLine1}, ${doctor.addressLine2}, ${doctor.city}, ${doctor.postcode}, ${doctor.state}` || "N/A"}</TableCell>
                      <TableCell>{doctor.dob || "N/A"}</TableCell>
                      <TableCell>{doctor.highestQualification || "N/A"}</TableCell>
                      <TableCell>{doctor.totalYearsOfExp || "N/A"}</TableCell>
                      <TableCell>{doctor.rating || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Doctor</DialogTitle>
          <DialogContent>
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
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default DoctorList;