
import React, { Fragment, useRef, useState, useEffect } from "react";
import "./LoginSignUp.css";

import Loader from "../layout/Loader/Loader";
import { Link } from "react-router-dom";

import LockOpenIcon from "@material-ui/icons/LockOpen";
import FaceIcon from "@material-ui/icons/Face";
import MailOutlineIcon from "@material-ui/icons/MailOutline";

import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  login,
  register,
} from "../../actions/userAction";

import { useAlert } from "react-alert";

const LoginSignUp = ({ history, location }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;

  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  // ---------------- LOGIN ----------------

  const loginSubmit = (e) => {
    e.preventDefault();

    dispatch(login(loginEmail, loginPassword));
  };

  // ---------------- REGISTER ----------------
// ---------------- REGISTER SUBMIT ----------------
const registerSubmit = (e) => {
  e.preventDefault();

  const myForm = new FormData();

  myForm.set("name", name);
  myForm.set("email", email);
  myForm.set("password", password);

  // Send default image or uploaded image base64 string
  myForm.set("avatar", avatar || avatarPreview);

  dispatch(register(myForm));
};

// ---------------- INPUT CHANGE ----------------
const registerDataChange = (e) => {
  if (e.target.name === "avatar") {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert.error("Please select an image file");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };

    reader.readAsDataURL(file);
  } else {
    setUser({
      ...user,
      [e.target.name.toLowerCase()]: e.target.value, // Forces lowercase key matching
    });
  }
};
  // ---------------- REDIRECT ----------------

  const redirect = location.search
    ? location.search.split("=")[1]
    : "/account";

  // ---------------- SWITCH LOGIN / REGISTER ----------------

 const switchTabs = (e, tab) => {
  if (tab === "login") {
    switcherTab.current.classList.add("shiftToNeutral");
    switcherTab.current.classList.remove("shiftToRight");

    registerTab.current.classList.remove("shiftToNeutralForm");
    loginTab.current.classList.remove("shiftToLeft");
  }

  if (tab === "register") {
    switcherTab.current.classList.add("shiftToRight");
    switcherTab.current.classList.remove("shiftToNeutral");

    registerTab.current.classList.add("shiftToNeutralForm");
    loginTab.current.classList.add("shiftToLeft");
  }
};

  // ---------------- USE EFFECT ----------------

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isAuthenticated) {
      history.push(redirect);
    }
  }, [
    dispatch,
    error,
    alert,
    history,
    isAuthenticated,
    redirect,
  ]);

  // ---------------- UI ----------------

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="LoginSignUpContainer">
            <div className="LoginSignUpBox">

              {/* LOGIN / REGISTER TOGGLE */}
              <div>
                <div className="login_signUp_toggle">
                  <p onClick={(e) => switchTabs(e, "login")}>
                    LOGIN
                  </p>

                  <p onClick={(e) => switchTabs(e, "register")}>
                    REGISTER
                  </p>
                </div>

                <button ref={switcherTab}></button>
              </div>

              {/* LOGIN FORM */}

              <form
                className="loginForm"
                ref={loginTab}
                onSubmit={loginSubmit}
              >
                <div className="loginEmail">
                  <MailOutlineIcon />

                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={loginEmail}
                    onChange={(e) =>
                      setLoginEmail(e.target.value)
                    }
                  />
                </div>

                <div className="loginPassword">
                  <LockOpenIcon />

                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={loginPassword}
                    onChange={(e) =>
                      setLoginPassword(e.target.value)
                    }
                  />
                </div>

                <Link to="/password/forgot">
                  Forgot Password?
                </Link>

                <input
                  type="submit"
                  value="Login"
                  className="loginBtn"
                />
              </form>

              {/* REGISTER FORM */}

              <form
                className="signUpForm"
                ref={registerTab}
                encType="multipart/form-data"
                onSubmit={registerSubmit}
              >

                <div className="signUpName">
                  <FaceIcon />

                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={registerDataChange}
                  />
                </div>

                <div className="signUpEmail">
                  <MailOutlineIcon />

                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={registerDataChange}
                  />
                </div>

                <div className="signUpPassword">
                  <LockOpenIcon />

                  <input
                    type="password"
                    placeholder="Password"
                    required
                    name="password"
                    value={password}
                    onChange={registerDataChange}
                  />
                </div>

                {/* AVATAR CONTAINER */}
                <div id="registerImage">
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                  />

                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={registerDataChange}
                  />
                </div>

                {/* REGISTER BUTTON OUTSIDE OF AVATAR DIV */}
                <input
                  type="submit"
                  className="signUpBtn"
                  value="Register"
                  disabled={loading}
                />

              </form>

            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default LoginSignUp;