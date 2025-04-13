import React from "react";
import { AppBar, Toolbar, Typography, Button, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(() => ({
  appBar: {
    zIndex: 1201, // Ensure it appears above other components
  },
  title: {
    flexGrow: 1,
  },
  logoutButton: {
    textTransform: "none",
  },
}));

const Topbar = () => {
  const classes = useStyles();
  const history = useHistory();

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken"); // Clear the session token
    history.push("/login"); // Redirect to the login page
  };

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Book My Consultation
        </Typography>
        <Button
          className={classes.logoutButton}
          color="inherit"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;