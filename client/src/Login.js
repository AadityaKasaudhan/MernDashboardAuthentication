import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BsArrowRepeat } from "react-icons/bs";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [alert, setAlert] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (captcha === userCaptcha) {
      axios
        .post("http://localhost:3002/login", { email, password })
        .then((result) => {
          console.log(result);
          if (result.data === "Success") {
            setAlert("User logged in successfully.");
            setTimeout(() => {
              setAlert("");
              navigate("/home");
            }, 1000);
          } else {
            setAlert("Wrong email or password.");
          }
        })
        .catch((err) => console.log(err));
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

  const handleContextMenu = (e) => {
    e.preventDefault();
    setAlert("Right-click not allowed.");
    setTimeout(() => {
      setAlert("");
    }, 1000);
  };

  const handleCopy = (e) => {
    e.preventDefault();
    setAlert("Copy not allowed.");
    setTimeout(() => {
      setAlert("");
    }, 1000);
  };

  const handleCut = (e) => {
    e.preventDefault();
    setAlert("Cut not allowed.");
    setTimeout(() => {
      setAlert("");
    }, 1000);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    setAlert("Paste not allowed.");
    setTimeout(() => {
      setAlert("");
    }, 1000);
  };

  // Captcha

  useEffect(() => {
    const randomCaptcha = Math.random().toString(36).substring(7);
    setCaptcha(randomCaptcha);
  }, []);

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
    <div
      className="d-flex justify-content-center align-items-center bg-secondary vh-100"
      onContextMenu={handleContextMenu}
      onCopy={handleCopy}
      onCut={handleCut}
      onPaste={handlePaste}
    >
      <div className="bg-white p-3 rounded w-25">
        <h2>
          <strong>Login</strong>
        </h2>
        <form onSubmit={handleSubmit}>
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
            Login
          </button>
          {alert && (
            <div className="alert alert-danger mt-3" role="alert">
              {alert}
            </div>
          )}
        </form>
        <p style={{ marginTop: "20px" }}>Don't Have an Account? Sign Up</p>
        <Link
          to="/"
          className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
          style={{ marginTop: "-20px" }}
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default Login;
