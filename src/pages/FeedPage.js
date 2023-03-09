import NewPost from "../components/post/NewPost";
import ShowAllPosts from "../components/ShowAllPosts";
import usersContext from "../context/usersContext";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import Cookies from "js-cookie";
import "./feed_styling/feed.css";
import Nav from "./Nav";
const FeedPage = () => {
  const data = useContext(usersContext);
  const navigate = useNavigate();
  useEffect(() => {
    !data.email && !Cookies.get("user") && navigate("/login");
  }, [data, navigate]);
  return (
    <div id="feed-page-container">
      <Nav />
      <Modal />
      {data.email && <NewPost />}
      {data.email && <ShowAllPosts />}
    </div>
  );
};
export default FeedPage;
