import React, { useEffect, useState } from "react";
import { Typography } from "@material-ui/core";
import axios from "../../util/fetch";

const DoctorDetails = ({ baseUrl, doctorId }) => {
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await axios.get(`${baseUrl}/doctors/${doctorId}`);
        setDoctor(response.data);
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      }
    };

    fetchDoctorDetails();
  }, [baseUrl, doctorId]);

  if (!doctor) {
    return <Typography>Loading doctor details...</Typography>;
  }

  return (
    <div>
      <Typography variant="h5">Doctor Details</Typography>
      <Typography>Name: {doctor.firstName} {doctor.lastName}</Typography>
      <Typography>Speciality: {doctor.speciality}</Typography>
      <Typography>Email: {doctor.email}</Typography>
      <Typography>Mobile: {doctor.mobile}</Typography>
      <Typography>
        Address: {doctor.address.addressLine1}, {doctor.address.city}, {doctor.address.state}, {doctor.address.postcode}
      </Typography>
    </div>
  );
};

export default DoctorDetails;