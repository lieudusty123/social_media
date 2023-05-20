import { useNavigate } from "react-router-dom";
import { useContext, useEffect, lazy } from "react";

import Cookies from "js-cookie";

import NewPost from "../../post/NewPost/NewPost";
import ShowAllPosts from "../../post/ShowAllPosts";
import usersContext from "../../../context/usersContext";

import "./feed_styling/feed.css";

const Modal = lazy(() => import("../../reuseable/Modal/Modal"));
const FeedPage = () => {
  const data = useContext(usersContext);
  const navigate = useNavigate();
  useEffect(() => {
    !data.email && !Cookies.get("user") && navigate("/login");
  }, [data, navigate]);
  return (
    <div id="feed-page-container">
      <Modal />
      {data.email && <NewPost />}
      {data.email && <ShowAllPosts />}
    </div>
  );
};
export default FeedPage;
