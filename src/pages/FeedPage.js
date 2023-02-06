import NewPost from "../components/post/NewPost";
import ShowAllPosts from "../components/ShowAllPosts";
import usersContext from "../context/usersContext";
import SetImage from "../components/user/SetImage";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
const FeedPage = () => {
  const data = useContext(usersContext);
  const navigate = useNavigate();
  useEffect(() => {
    !data.email && !Cookies.get("user") && navigate("/login");
  }, [data, navigate]);
  return (
    <>
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
    </>
  );
};
export default FeedPage;
