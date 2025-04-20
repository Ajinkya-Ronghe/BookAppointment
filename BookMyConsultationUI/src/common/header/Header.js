import React, { useState } from "react";
import Modal from "react-modal";
import { Button, Tabs, Tab, Card, CardContent, Typography, FormControl, InputLabel, Input, FormHelperText } from "@material-ui/core";
import "./Header.css";
import logo from "../../assets/logo.jpeg";
import apiClient from "../../util/fetch";

Modal.setAppElement("#root");

const Header = ({ forceLoginModal, setForceLoginModal }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginEmailError, setLoginEmailError] = useState("");
  const [loginPasswordError, setLoginPasswordError] = useState("");
  const [loginGeneralError, setLoginGeneralError] = useState("");
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobile: ""
  });
  const [registerErrors, setRegisterErrors] = useState({});
  const [registerGeneralError, setRegisterGeneralError] = useState("");
  const isLoggedIn = !!sessionStorage.getItem("accessToken");

  React.useEffect(() => {
    if (forceLoginModal) setModalIsOpen(true);
  }, [forceLoginModal]);

  const handleLoginOpen = () => setModalIsOpen(true);
  const handleLoginClose = () => {
    setModalIsOpen(false);
    setTabValue(0);
    setLoginEmail("");
    setLoginPassword("");
    setLoginEmailError("");
    setLoginPasswordError("");
    setLoginGeneralError("");
    setRegisterForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      mobile: ""
    });
    setRegisterErrors({});
    setRegisterGeneralError("");
    if (setForceLoginModal) setForceLoginModal(false);
  };
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setLoginEmail("");
    setLoginPassword("");
    setLoginEmailError("");
    setLoginPasswordError("");
    setLoginGeneralError("");
    setRegisterForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      mobile: ""
    });
    setRegisterErrors({});
    setRegisterGeneralError("");
  };
  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = async (e) => {
    e.preventDefault();
    let valid = true;
    setLoginEmailError("");
    setLoginPasswordError("");
    setLoginGeneralError("");

    if (!loginEmail) {
      setLoginEmailError("Please fill out this field");
      valid = false;
    } else if (!emailRegex.test(loginEmail)) {
      setLoginEmailError("Enter valid Email");
      valid = false;
    }
    if (!loginPassword) {
      setLoginPasswordError("Please fill out this field");
      valid = false;
    }
    if (!valid) return;

    try {
      const response = await apiClient.post(
        "/auth/login",
        {},
        {
          headers: {
            Authorization: `Basic ${btoa(`${loginEmail}:${loginPassword}`)}`,
          },
        }
      );
      sessionStorage.setItem("accessToken", response.data.accessToken);
      handleLoginClose();
      window.location.reload();
    } catch (error) {
      setLoginGeneralError("Invalid email or password. Please try again.");
    }
  };

  const handleRegisterInput = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
    setRegisterErrors({ ...registerErrors, [e.target.name]: "" });
    setRegisterGeneralError("");
  };

  const validateRegister = () => {
    const errors = {};
    if (!registerForm.firstName) errors.firstName = "Please fill out this field";
    if (!registerForm.lastName) errors.lastName = "Please fill out this field";
    if (!registerForm.email) errors.email = "Please fill out this field";
    else if (!emailRegex.test(registerForm.email)) errors.email = "Enter valid Email";
    if (!registerForm.password) errors.password = "Please fill out this field";
    if (!registerForm.mobile) errors.mobile = "Please fill out this field";
    else if (!/^\d{10}$/.test(registerForm.mobile)) errors.mobile = "Enter valid 10 digit mobile number";
    return errors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const errors = validateRegister();
    setRegisterErrors(errors);
    setRegisterGeneralError("");
    if (Object.keys(errors).length > 0) return;
    try {
      await apiClient.post("/users", {
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
        emailId: registerForm.email,
        password: registerForm.password,
        mobile: registerForm.mobile
      });
      handleLoginClose();
      alert("Registration successful! Please login.");
    } catch (error) {
      setRegisterGeneralError("Registration failed. Please try again.");
    }
  };

  return (
    <header className="header-root">
      <div className="header-logo-container">
        <img src={logo} alt="logo" className="header-logo" />
        <span className="header-title">Doctor Finder</span>
      </div>
      <div className="header-btn-container">
        {isLoggedIn ? (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            className="header-btn"
          >
            Logout
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleLoginOpen}
            className="header-btn"
          >
            Login
          </Button>
        )}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleLoginClose}
        className="header-modal"
        overlayClassName="header-modal-overlay"
        shouldCloseOnOverlayClick={true}
        ariaHideApp={false}
        style={undefined} // Use CSS for all styling
      >
        <Card>
          <Typography variant="h6" className="auth-title">
            Authentication
          </Typography>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            centered
            style={{ marginTop: 8 }}
          >
            <Tab label="LOGIN" />
            <Tab label="REGISTER" />
          </Tabs>
          <CardContent style={{ minWidth: 320, paddingTop: 8 }}>
            {tabValue === 0 ? (
              <form onSubmit={handleLogin}>
                <FormControl fullWidth margin="normal" error={!!loginEmailError}>
                  <InputLabel htmlFor="login-email">Username</InputLabel>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={e => {
                      setLoginEmail(e.target.value);
                      setLoginEmailError("");
                      setLoginGeneralError("");
                    }}
                  />
                  {loginEmailError && <FormHelperText>{loginEmailError}</FormHelperText>}
                </FormControl>
                <FormControl fullWidth margin="normal" error={!!loginPasswordError}>
                  <InputLabel htmlFor="login-password">Password</InputLabel>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={e => {
                      setLoginPassword(e.target.value);
                      setLoginPasswordError("");
                      setLoginGeneralError("");
                    }}
                  />
                  {loginPasswordError && <FormHelperText>{loginPasswordError}</FormHelperText>}
                </FormControl>
                {loginGeneralError && (
                  <Typography style={{ color: "red", marginTop: 8 }}>{loginGeneralError}</Typography>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  style={{ marginTop: 16, textTransform: "none" }}
                  fullWidth
                >
                  LOGIN
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <FormControl fullWidth margin="normal" error={!!registerErrors.firstName}>
                  <InputLabel htmlFor="register-firstName">First Name</InputLabel>
                  <Input
                    id="register-firstName"
                    name="firstName"
                    value={registerForm.firstName}
                    onChange={handleRegisterInput}
                  />
                  {registerErrors.firstName && <FormHelperText>{registerErrors.firstName}</FormHelperText>}
                </FormControl>
                <FormControl fullWidth margin="normal" error={!!registerErrors.lastName}>
                  <InputLabel htmlFor="register-lastName">Last Name</InputLabel>
                  <Input
                    id="register-lastName"
                    name="lastName"
                    value={registerForm.lastName}
                    onChange={handleRegisterInput}
                  />
                  {registerErrors.lastName && <FormHelperText>{registerErrors.lastName}</FormHelperText>}
                </FormControl>
                <FormControl fullWidth margin="normal" error={!!registerErrors.email}>
                  <InputLabel htmlFor="register-email">Email</InputLabel>
                  <Input
                    id="register-email"
                    name="email"
                    value={registerForm.email}
                    onChange={handleRegisterInput}
                  />
                  {registerErrors.email && <FormHelperText>{registerErrors.email}</FormHelperText>}
                </FormControl>
                <FormControl fullWidth margin="normal" error={!!registerErrors.password}>
                  <InputLabel htmlFor="register-password">Password</InputLabel>
                  <Input
                    id="register-password"
                    name="password"
                    type="password"
                    value={registerForm.password}
                    onChange={handleRegisterInput}
                  />
                  {registerErrors.password && <FormHelperText>{registerErrors.password}</FormHelperText>}
                </FormControl>
                <FormControl fullWidth margin="normal" error={!!registerErrors.mobile}>
                  <InputLabel htmlFor="register-mobile">Mobile Number</InputLabel>
                  <Input
                    id="register-mobile"
                    name="mobile"
                    value={registerForm.mobile}
                    onChange={handleRegisterInput}
                  />
                  {registerErrors.mobile && <FormHelperText>{registerErrors.mobile}</FormHelperText>}
                </FormControl>
                {registerGeneralError && (
                  <Typography style={{ color: "red", marginTop: 8 }}>{registerGeneralError}</Typography>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  style={{ marginTop: 16, textTransform: "none" }}
                  fullWidth
                >
                  REGISTER
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </Modal>
    </header>
  );
};

export default Header;
