import { useContext, useState } from "react";
import axios from "axios";
import usersContext from "../context/usersContext";
const LoginSignin = () => {
  const data = useContext(usersContext);
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  function handleSignUpSubmit(e) {
    e.preventDefault();
    axios
      .post("http://localhost:8000/sign-up", {
        name: signUpName,
        email: signUpEmail,
        password: signUpPassword,
        image: "default",
      })
      .then(() => {
        alert("User was created!");
      });
    setSignUpName("");
    setSignUpEmail("");
    setSignUpPassword("");
  }
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  async function handleLoginSubmit(e) {
    e.preventDefault();
    const res = await axios.post("http://localhost:8000/login", {
      email: loginEmail,
      password: loginPassword,
    });
    console.log(res.data);
    data.login(
      res.data.email,
      res.data.userId,
      res.data.userName,
      res.data.image
    );
  }
  return (
    <div>
      <div>Email</div>
      <div></div>
      <div>Sign up</div>
      <form onSubmit={handleSignUpSubmit}>
        <input
          type="text"
          placeholder="name"
          value={signUpName}
          onChange={(e) => setSignUpName(e.target.value)}
        />
        <input
          type="email"
          placeholder="email"
          value={signUpEmail}
          onChange={(e) => setSignUpEmail(e.target.value)}
        />
        <input
          type="password"
          value={signUpPassword}
          onChange={(e) => setSignUpPassword(e.target.value)}
        />
        <button type="submit">Submit!</button>
      </form>
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
