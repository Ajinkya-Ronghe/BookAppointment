import React from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import Home from "../screens/home/Home";
import Dashboard from "../screens/dashboard/Dashboard";
import DoctorList from "../screens/doctorList/DoctorList";
import BookAppointment from "../screens/appointment/BookAppointment";
import RateAppointment from "../screens/appointment/RateAppointment";
import Login from "../screens/login/Login";
import Register from "../screens/register/Register";
import PrivateRoute from "../common/PrivateRoute"; // Import PrivateRoute

const Controller = () => {
  const baseUrl = "http://localhost:8081"; // Ensure this is the correct backend URL

  return (
    <Router>
      <div className="main-container">
        <Switch>
          <Route exact path="/" render={(props) => <Home {...props} />} />
          <PrivateRoute
            path="/dashboard"
            component={(props) => <Dashboard {...props} baseUrl={baseUrl} />}
          />
          <PrivateRoute
            path="/appointments/new"
            component={(props) => <BookAppointment {...props} baseUrl={baseUrl} />}
          />
          <PrivateRoute
            path="/appointments/rate"
            component={(props) => <RateAppointment {...props} baseUrl={baseUrl} />}
          />
          <PrivateRoute
            path="/doctors"
            component={(props) => <DoctorList {...props} baseUrl={baseUrl} />}
          />
          <Route
            path="/login"
            render={(props) => <Login {...props} baseUrl={baseUrl} />}
          />
          <Route
            path="/register"
            render={(props) => <Register {...props} baseUrl={baseUrl} />}
          />
          {/* Catch-All Route */}
          <Route path="*">
            <Redirect to="/login" />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default Controller;
