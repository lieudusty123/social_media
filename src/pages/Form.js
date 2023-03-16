import { useRef, useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import usersContext from "../context/usersContext";
import Cookies from "js-cookie";
import axios from "axios";
import Modal from "../components/Modal";
import isEmail from "validator/lib/isEmail";
import "./feed_styling/feed.css";
import "./form_styling/form_styling.css";
const Form = () => {
  const data = useContext(usersContext);
  const navigate = useNavigate();

  // -----------------

  //login refs
  const loginButtonRef = useRef();
  const loginEmailRef = useRef();
  const loginPasswordRef = useRef();

  //login refs

  //login useState
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  //login useState

  //signup refs
  const signupNameRef = useRef();
  const signupIdRef = useRef();
  const signupEmailRef = useRef();
  const signupPasswordRef = useRef();
  const signupButtonRef = useRef();
  //signup refs

  //signup useState
  const [signupName, setSignupName] = useState("");
  const [signupId, setSignupId] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupErrorMessage, setSignupErrorMessage] = useState("");
  //signup useState

  const containerRef = useRef();

  // -----------------
  const location = useLocation();
  useEffect(() => {
    data.email && navigate("/");
  }, [data, navigate]);

  function handleSignUpSubmit(e) {
    e.preventDefault();
    if (
      signupName.length >= 5 &&
      signupId.length >= 5 &&
      isEmail(signupEmail) &&
      signupPassword.length >= 5
    ) {
      axios
        .post("http://localhost:3000/sign-up", {
          name: signupName,
          id: signupId,
          email: signupEmail,
          password: signupPassword,
          image: "default",
        })
        .then(() => {
          data.login(
            signupName.userName,
            signupId.userId,
            signupEmail.email,
            "default"
          );
          if (localStorage.getItem("cookieConsent") === "true") {
            let str = JSON.stringify({
              userName: signupName,
              userId: signupId,
              email: signupEmail,
            });
            Cookies.set("user", str);
          }
          alert("User was created!");
          setSignupName("");
          setSignupId("");
          setSignupEmail("");
          setSignupPassword("");
        })
        .catch((e) => {
          setSignupErrorMessage(e.response.data);
        });
    } else if (signupName.length < 5) {
      setSignupErrorMessage("User name too short");
    } else if (signupId.length < 5) {
      setSignupErrorMessage("ID too short");
    } else if (!isEmail(signupEmail)) {
      setSignupErrorMessage("Invalid Email");
    } else if (signupPassword.length < 5) {
      setSignupErrorMessage("Password too short");
    }
  }
  function handleLoginSubmit(e) {
    e.preventDefault();
    if (isEmail(loginEmail) && loginPassword.length >= 5) {
      axios
        .post("http://localhost:3000/login", {
          email: loginEmail,
          password: loginPassword,
        })
        .then((res) => {
          data.login(
            res.data.email,
            res.data.userId,
            res.data.userName,
            res.data.image
          );
          if (localStorage.getItem("cookieConsent") === "true") {
            let str = JSON.stringify({
              email: res.data.email,
              userId: res.data.userId,
              userName: res.data.userName,
            });
            Cookies.set("user", str);
          }
        })
        .catch((e) => {
          setLoginErrorMessage(e.response.data);
        });
    } else if (!isEmail(loginEmail)) {
      setLoginErrorMessage("Invalid Email");
    } else if (signupPassword.length < 5) {
      setLoginErrorMessage("Password too short");
    }
  }
  return (
    <>
      <Modal />
      <div id="FormComponent">
        <div
          className={`container ${
            location.pathname === "/signup" && "right-panel-active"
          }`}
          ref={containerRef}
          id="container"
        >
          <div className="form-container sign-up-container">
            <form onSubmit={handleSignUpSubmit}>
              <h1>Create Account</h1>
              <div id="collapsed-sign-up-button">
                <input
                  type="text"
                  ref={signupNameRef}
                  value={signupName}
                  onChange={(e) => {
                    setSignupName(e.target.value);
                    e.target.value.length >= 5 || e.target.value.length === 0
                      ? (signupNameRef.current.style.border = "none")
                      : (signupNameRef.current.style.border = "1px solid red");
                  }}
                  placeholder="Name"
                />
                <input
                  type="text"
                  ref={signupIdRef}
                  value={signupId}
                  onChange={(e) => {
                    setSignupId(e.target.value);
                    e.target.value.length >= 5 || e.target.value.length === 0
                      ? (signupIdRef.current.style.border = "none")
                      : (signupIdRef.current.style.border = "1px solid red");
                  }}
                  placeholder="User ID"
                />
              </div>
              <input
                type="email"
                ref={signupEmailRef}
                value={signupEmail}
                onChange={(e) => {
                  setSignupEmail(e.target.value);
                  isEmail(e.target.value) || e.target.value.length === 0
                    ? (signupEmailRef.current.style.border = "none")
                    : (signupEmailRef.current.style.border = "1px solid red");
                }}
                placeholder="Email"
              />
              <input
                type="password"
                ref={signupPasswordRef}
                value={signupPassword}
                onChange={(e) => {
                  setSignupPassword(e.target.value);
                  e.target.value.length >= 5 || e.target.value.length === 0
                    ? (signupPasswordRef.current.style.border = "none")
                    : (signupPasswordRef.current.style.border =
                        "1px solid red");
                }}
                placeholder="Password"
              />
              <div className="wrong-input">{signupErrorMessage}</div>
              <button>Sign Up</button>
              <div
                className="signIn-mobile"
                onClick={() =>
                  containerRef.current.classList.remove("right-panel-active")
                }
              >
                Sign in
              </div>
            </form>
          </div>
          <div className="form-container sign-in-container">
            <form onSubmit={handleLoginSubmit}>
              <h1>Sign in</h1>
              <br />
              <input
                type="email"
                ref={loginEmailRef}
                onChange={(e) => {
                  setLoginEmail(e.target.value);
                  e.target.value.length === 0 ||
                  (e.target.value.length >= 5 &&
                    e.target.value.indexOf("@") !== -1)
                    ? (loginEmailRef.current.style.border = "none")
                    : (loginEmailRef.current.style.border = "1px solid red");
                }}
                placeholder="Email"
              />
              <input
                type="password"
                ref={loginPasswordRef}
                onChange={(e) => {
                  setLoginPassword(e.target.value);
                  e.target.value.length >= 5 || e.target.value.length === 0
                    ? (loginPasswordRef.current.style.border = "none")
                    : (loginPasswordRef.current.style.border = "1px solid red");
                }}
                placeholder="Password"
              />
              <div className="wrong-input">{loginErrorMessage}</div>
              <button>Sign In</button>
              <div
                className="signUp-mobile"
                onClick={() =>
                  containerRef.current.classList.add("right-panel-active")
                }
              >
                Sign up
              </div>
            </form>
          </div>
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Welcome Back!</h1>
                <p>Never miss a beat, log in and enjoy the journey.</p>
                <button
                  className="ghost"
                  id="signIn"
                  ref={loginButtonRef}
                  onClick={() =>
                    containerRef.current.classList.remove("right-panel-active")
                  }
                >
                  Sign In
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>Hello, Friend!</h1>
                <p>Don't miss out! Join today and stay connected.</p>
                <button
                  className="ghost"
                  id="signUp"
                  ref={signupButtonRef}
                  onClick={() =>
                    containerRef.current.classList.add("right-panel-active")
                  }
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Form;
