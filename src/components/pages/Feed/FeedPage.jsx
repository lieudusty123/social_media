import { useContext, lazy } from "react";

import NewPost from "../../post/NewPost/NewPost";
import ShowAllPosts from "../../post/ShowAllPosts";
import usersContext from "../../../context/usersContext";

import "./feed_styling/feed.css";

const Modal = lazy(() => import("../../reuseable/Modal/Modal"));
const FeedPage = () => {
  const data = useContext(usersContext);

  return (
    <div id="feed-page-container">
      <Modal />
      {data.email && <NewPost />}
      <ShowAllPosts />
    </div>
  );
};
export default FeedPage;
