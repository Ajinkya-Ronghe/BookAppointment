import React, { useState } from "react";
import { TextField, Button, Typography, AppBar, Toolbar, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import apiClient from "../../util/fetch";

const useStyles = makeStyles(() => ({
  appBar: {
    zIndex: 1201, // Ensure it appears above other components
    backgroundColor: "#3f51b5", // Updated color code from Dashboard's Topbar
  },
  toolbar: {
    display: "flex",
    justifyContent: "center", // Center the content horizontally
    alignItems: "center", // Align items vertically
    position: "relative", // Allow absolute positioning for the Home button
  },
  homeButton: {
    position: "absolute", // Position the Home button absolutely
    left: "10px", // Align it to the left
    textTransform: "none",
    color: "#fff",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
  },
  container: {
    padding: "20px",
    maxWidth: "400px",
    margin: "50px auto",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    marginTop: "80px", // Add margin to account for the fixed Topbar
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "1rem",
    textTransform: "none",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
    fontSize: "0.9rem",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

const Register = ({ baseUrl }) => {
  const classes = useStyles();
  const history = useHistory();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    const userData = {
      firstName,
      lastName,
      emailId,
      mobile,
      password,
    };

    try {
      const response = await apiClient.post(`${baseUrl}/users/register`, userData);
      alert("Registration successful!");
      history.push("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Failed to register. Please try again.");
    }
  };

  return (
    <div>
      {/* Topbar with Home Tab */}
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Button
            className={classes.homeButton}
            onClick={() => history.push("/")} // Navigate to Home screen
          >
            Home
          </Button>
          <Typography variant="h6">Book My Consultation</Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.container}>
        <Typography className={classes.title}>Register</Typography>
        {error && <Typography className={classes.error}>{error}</Typography>}
        <TextField
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          type="email"
          value={emailId}
          onChange={(e) => setEmailId(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Mobile"
          type="tel"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={handleRegister}
        >
          Register
        </Button>
        {/* Login Link */}
        <div>
          <a className={classes.link} href="/login">
            Already have an account? Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;