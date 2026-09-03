import React from "react";
import "./About.css";
import { Button, Typography, Avatar } from "@material-ui/core"; // Use "@mui/material" for MUI v5
import YouTubeIcon from "@material-ui/icons/YouTube";
import InstagramIcon from "@material-ui/icons/Instagram";

const About = () => {
  const visitInstagram = () => {
    window.location = "https://instagram.com/meabhisingh";
  };

  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/triplej/image/upload/v1633008670/avatars/portrait-placeholder_q4d0f6.jpg"
              alt="Founder"
            />
            <Typography>Abhishek Singh</Typography>
            <Button onClick={visitInstagram} color="primary">
              Visit Instagram
            </Button>
            <span>
              This is a sample e-commerce website made by @meabhisingh solely for the purpose of teaching MERN Stack on 6 Pack Programmer.
            </span>
          </div>

          <div className="aboutSectionContainer2">
            <Typography component="h2">Our Brands</Typography>
            <a
              href="https://www.youtube.com/6packprogrammer"
              target="blank"
            >
              <YouTubeIcon className="youtubeSvgIcon" />
            </a>

            <a href="https://instagram.com/meabhisingh" target="blank">
              <InstagramIcon className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;