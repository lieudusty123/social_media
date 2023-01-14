import { useContext, useEffect, useState } from "react";
import axios from "axios";
import usersContext from "../context/usersContext";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
const LoginSignin = () => {
  const data = useContext(usersContext);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    data.email && navigate("/");
  }, [data, navigate]);
  function handleLoginSubmit(e) {
    e.preventDefault();
    axios
      .post("http://localhost:8000/login", {
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
      });
  }
  return (
    <div>
      <Modal />
      {data.email === undefined && (
        <form onSubmit={handleLoginSubmit}>
          <div>Sign In</div>
          <input
            type="email"
            onChange={(e) => {
              setLoginEmail(e.target.value);
            }}
            value={loginEmail}
          />
          <input
            type="password"
            onChange={(e) => {
              setLoginPassword(e.target.value);
            }}
            value={loginPassword}
          />
          <button>Login</button>
        </form>
      )}
      {data.email !== undefined && (
        <button
          onClick={() => {
            data.logOut();
          }}
        >
          Log out
        </button>
      )}
    </div>
  );
};
export default LoginSignin;
