import "./App.css";
import { useState, useContext, useRef } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import usersContext from "./context/usersContext";
import ShowAllPosts from "./components/ShowAllPosts";
import SetImage from "./components/user/SetImage";
let image;
function App() {
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const data = useContext(usersContext);

  let [mapped, setMapped] = useState([]);
  async function fetchData() {
    const res = await axios.get("http://localhost:8000/all");
    let temp = [];
    res.data.response.forEach((output) =>
      temp.push(
        <div key={uuidv4()}>
          {output.name}, {output.age}
        </div>
      )
    );
    setMapped(temp);
  }

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

  const [textData, setTextData] = useState("");
  const imageRef = useRef();
  async function handleNewPostSubmit(e) {
    e.preventDefault();
    if (imageRef.current["files"][0] && textData.length > 0) {
      let passedStr = "";
      let reader = new FileReader();
      reader.readAsDataURL(imageRef.current["files"][0]);
      reader.onload = function () {
        passedStr = reader.result;
        axios
          .post("http://localhost:8000/new-post", {
            userId: data.userId,
            image: passedStr,
            title: textData,
          })
          .then(() => {
            imageRef.current.value = null;
            setTextData("");
          });
      };
    } else {
      console.log("missing data!");
    }
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
  function clearUsersColl() {
    axios.post("http://localhost:8000/clear-user-data");
  }
  function clearPosts() {
    axios
      .post("http://localhost:8000/clear-posts")
      .then((response) => console.log(response));
  }
  return (
    <header className="App-header">
      <button onClick={clearUsersColl}>!!!DELETE USERS!!!</button>
      <button onClick={clearPosts}>!!!DELETE POSTS!!!</button>
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
      <div>Fetch data</div>
      <button onClick={fetchData}>Get Data!</button>
      {data.email && (
        <form onSubmit={handleNewPostSubmit}>
          <div>New Post</div>
          <input
            type="text"
            placeholder="Write your post"
            value={textData}
            onChange={(e) => setTextData(e.target.value)}
          />
          <input type="file" ref={imageRef} />
          <button type="submit">Submit Post</button>
        </form>
      )}
      {mapped}
      {image}
      {data.userName && <SetImage />}
      <ShowAllPosts />
    </header>
  );
}

export default App;
