import React from "react";
import { Typography, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom"; // Use useHistory instead of useNavigate
import "./Home.css";

const Home = () => {
  const history = useHistory(); // Initialize useHistory

  return (
    <div className="home-container">
      <Typography className="home-title" variant="h4" gutterBottom>
        Welcome to Book My Consultation
      </Typography>
      <div className="home-buttons">
        <Button
          className="home-button"
          variant="contained"
          color="primary"
          onClick={() => history.push("/login")} // Use history.push
        >
          Login
        </Button>
        <Button
          className="home-button"
          variant="contained"
          color="secondary"
          onClick={() => history.push("/register")} // Use history.push
        >
          Register
        </Button>
      </div>
    </div>
  );
};

export default Home;