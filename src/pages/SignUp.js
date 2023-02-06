import { useState } from "react";
import axios from "axios";
import Modal from "../components/Modal";
function SignUp() {
  const [signUpName, setSignUpName] = useState("");
  const [signUpId, setSignUpId] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  function handleSignUpSubmit(e) {
    e.preventDefault();
    axios
      .get("http://localhost:8000/check-user-id", { id: signUpId })
      .then(() => {
        axios
          .post("http://localhost:8000/sign-up", {
            name: signUpName,
            id: signUpId,
            email: signUpEmail,
            password: signUpPassword,
            image: "default",
          })
          .then(() => {
            alert("User was created!");
          });
        setSignUpName("");
        setSignUpId("");
        setSignUpEmail("");
        setSignUpPassword("");
      })
      .catch((e) => {
        console.log(e);
        alert("user id is taken!");
      });
  }
  return (
    <>
      <Modal />
      <div>Sign up</div>
      <form onSubmit={handleSignUpSubmit}>
        <input
          type="text"
          placeholder="name"
          value={signUpName}
          onChange={(e) => setSignUpName(e.target.value)}
        />
        <input
          type="text"
          placeholder="id"
          value={signUpId}
          onChange={(e) => setSignUpId(e.target.value)}
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
    </>
  );
}
export default SignUp;
