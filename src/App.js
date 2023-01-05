import "./App.css";
import { useContext } from "react";
import axios from "axios";
import usersContext from "./context/usersContext";
import SetImage from "./components/user/SetImage";
let image;
function App() {
  const data = useContext(usersContext);

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
      {image}
      {data.userName && <SetImage />}
      {/* <ShowAllPosts /> */}
    </header>
  );
}

export default App;
