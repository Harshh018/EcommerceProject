import React from "react";
import "./Contact.css";
import { Button } from "@material-ui/core"; // Use "@mui/material" if using MUI v5

const Contact = () => {
  return (
    <div className="contactContainer">
      <a className="mailBtn" href="mailto:your-email@gmail.com">
        <Button>Contact: your-email@gmail.com</Button>
      </a>
    </div>
  );
};

export default Contact;