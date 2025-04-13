import React, { useState } from "react";
import { TextField, Button, Typography, makeStyles } from "@material-ui/core";
import apiClient from "../../util/fetch";

const useStyles = makeStyles(() => ({
  container: {
    padding: "20px",
    maxWidth: "400px",
    margin: "50px auto",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
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
}));

const Register = ({ baseUrl, history }) => {
  const classes = useStyles();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState(""); // Updated field name
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    const userData = {
      firstName,
      lastName,
      emailId, // Correct field name
      mobile,
      password,
    };

    try {
      const response = await apiClient.post(`${baseUrl}/users`, userData);
      alert("Registration successful!");
      history.push("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Failed to register. Please try again.");
    }
  };

  return (
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
        value={emailId} // Updated field name
        onChange={(e) => setEmailId(e.target.value)} // Updated field name
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
    </div>
  );
};

export default Register;