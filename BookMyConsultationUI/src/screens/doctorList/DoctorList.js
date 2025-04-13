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
  makeStyles,
} from "@material-ui/core";
import axios from "../../util/fetch";
import Topbar from "../../common/Topbar"; // Import Topbar

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
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },
  filterContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
    gap: "20px",
  },
  clearButton: {
    width: "300px", // Set a fixed width for the Clear Filters button
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
        setSpecialities(response.data); // Update specialities state
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
        const address = doctor.address
          ? `${doctor.address.addressLine1}, ${doctor.address.city}, ${doctor.address.state}, ${doctor.address.postcode}`
          : "";
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

  return (
    <div>
      <Topbar /> {/* Add Topbar */}
      <div className={classes.container}>
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
            className={classes.clearButton} // Apply the custom style
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
                      <TableCell>
                        {doctor.address
                          ? `${doctor.address.addressLine1}, ${doctor.address.city}, ${doctor.address.state}, ${doctor.address.postcode}`
                          : "N/A"}
                      </TableCell>
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
      </div>
    </div>
  );
};

export default DoctorList;