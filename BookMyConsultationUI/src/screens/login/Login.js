import React, { useState } from "react";
import { TextField, Button, Typography, makeStyles } from "@material-ui/core";
import apiClient from "../../util/fetch";
import "./Login.css";

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

const Login = ({ baseUrl }) => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await apiClient.post(
        `${baseUrl}/auth/login`,
        {},
        {
          headers: {
            Authorization: `Basic ${btoa(`${email}:${password}`)}`,
          },
        }
      );
      alert("Login successful!");
      sessionStorage.setItem("accessToken", response.data.accessToken); // Store token in sessionStorage
      window.location.href = "/dashboard"; // Hardcoded redirection to Dashboard
    } catch (error) {
      console.error("Login failed:", error);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className={classes.container}>
      <Typography className={classes.title}>Login</Typography>
      {error && <Typography className={classes.error}>{error}</Typography>}
      <form onSubmit={handleLogin}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          type="submit"
        >
          Login
        </Button>
      </form>
      <div className={classes.links}>
        <a className={classes.link} href="/forgot-password">
          Forgot Password?
        </a>
        <a className={classes.link} href="/register">
          Register
        </a>
      </div>
    </div>
  );
};

export default Login;