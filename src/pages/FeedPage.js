import NewPost from "../components/post/NewPost";
import ShowAllPosts from "../components/ShowAllPosts";
import usersContext from "../context/usersContext";
import SetImage from "../components/user/SetImage";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./feed_styling/feed.css";
const FeedPage = () => {
  const data = useContext(usersContext);
  const navigate = useNavigate();
  useEffect(() => {
    !data.email && !Cookies.get("user") && navigate("/login");
    // let styles = {
    //   minHeight: "100vh",
    //   background:
    //     "linear-gradient(0deg,rgba(46, 52, 70, 1) 30%,rgba(33, 35, 41, 1) 100%)",
    //   backgroundAttachment: "fixed",
    //   display: "flex",
    //   flexDirection: "column",
    //   alignItems: "center",
    // };
    // Object.assign(document.querySelector("body").style, styles);
  }, [data, navigate]);
  return (
    <div id="feed-page-container">
      <button
        onClick={() => {
          axios.post("http://localhost:8000/clear-all-data");
        }}
      >
        Remove all data
      </button>
      <Modal />
      {data.image && <SetImage />}
      {data.email && <NewPost />}
      <ShowAllPosts />
    </div>
  );
};
export default FeedPage;
