import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { BsArrowRepeat } from "react-icons/bs";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [alert, setAlert] = useState("");

  const navigate = useNavigate();

  // Disable right-click, copy, cut, and paste
  useEffect(() => {
    const disableActions = (e) => {
      e.preventDefault();
      setAlert("Action not allowed.");
      setTimeout(() => {
        setAlert("");
      }, 1000);
    };

    window.addEventListener("contextmenu", disableActions);
    window.addEventListener("copy", disableActions);
    window.addEventListener("cut", disableActions);
    window.addEventListener("paste", disableActions);

    return () => {
      window.removeEventListener("contextmenu", disableActions);
      window.removeEventListener("copy", disableActions);
      window.removeEventListener("cut", disableActions);
      window.removeEventListener("paste", disableActions);
    };
  }, []);

  useEffect(() => {
    // Generate a random captcha value
    const randomCaptcha = Math.random().toString(36).substring(7);
    setCaptcha(randomCaptcha);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validatePassword() && captcha === userCaptcha) {
      axios
        .post("http://localhost:3002/register", {
          name,
          email,
          password,
        })
        .then((result) => {
          console.log(result);
          setName("");
          setEmail("");
          setPassword("");
          setCaptcha(""); // Clear the captcha after successful submission
          setSignupSuccess(true);
        })
        .catch((err) => {
          if (err.response.status === 409) {
            setEmailExists(true);
          } else {
            console.log(err);
          }
        });
    } else {
      setAlert("Captcha is not matched. Please try again.");
      setTimeout(() => {
        setAlert("");
        const randomCaptcha = Math.random().toString(36).substring(7);
        setCaptcha(randomCaptcha);
      }, 1000);
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#./])[A-Za-z\d@$!%*?&^#./]{6,}$/;

    const isPasswordValid = passwordRegex.test(newPassword);

    // Show or hide the popup based on password validity and non-empty password field
    setShowPasswordPopup(newPassword.trim() !== "" && !isPasswordValid);
  };

  const validatePassword = () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&^#./]{6,}$/;
    return passwordRegex.test(password);
  };

  const handleNameChange = (e) => {
    let input = e.target.value;
    input = input.replace(/[^a-zA-Z\s]/g, "");
    input = input.toUpperCase();
    setName(input);
  };

  useEffect(() => {
    const handleBackButton = (e) => {
      e.preventDefault();
      window.history.pushState(null, "", window.location.pathname);
    };

    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>
          <strong>Sign-Up</strong>
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Name</strong>
            </label>
            <input
              type="text"
              placeholder="Enter Name"
              autoComplete="off"
              name="name"
              className="form-control rounded-0"
              value={name}
              onChange={handleNameChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              name="email"
              className="form-control rounded-0"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {emailExists && email.trim() !== "" && (
            <p style={{ color: "red" }}>
              This email is already registered. Please use a different email.
            </p>
          )}

          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              className="form-control rounded-0"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            {showPasswordPopup && (
              <p style={{ color: "red", marginTop: "5px" }}>
                Password should be at least 6 characters long and contain at
                least 1 uppercase letter, 1 lowercase letter, 1 number, and 1
                special character.
              </p>
            )}
          </div>
          <div className="mb-3 d-flex align-items-center">
            <label htmlFor="captcha" className="me-2">
              <strong>Captcha:</strong>
            </label>
            <span className="me-2">{captcha}</span>
            <BsArrowRepeat
              className="text-primary me-2"
              style={{ cursor: "pointer", fontSize: "1.2rem", transform: "scale(1.5)", marginRight: "10px" }}
              onClick={() => {
                const randomCaptcha = Math.random().toString(36).substring(7);
                setCaptcha(randomCaptcha);
              }}
            />
            <input
              type="text"
              placeholder="Enter Captcha"
              name="captcha"
              className="form-control rounded-0 flex-grow-1"
              onChange={(e) => setUserCaptcha(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100 rounded-0">
            Register
          </button>
        </form>
        {signupSuccess && (
          <div className="alert alert-success mt-3" role="alert">
            Sign up successful! Continue to <Link to="/login">Login</Link>.
          </div>
        )}
        {alert && (
          <div className="alert alert-danger mt-3" role="alert">
            {alert}
          </div>
        )}
        <p style={{ marginTop: "20px" }}>Already Have an Account? Login</p>
        <Link
          to="/login"
          className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
          style={{ marginTop: "-20px" }}
        >
          Login
        </Link>
      </div>
    </div>
  );
}

export default Signup;
