import NewPost from "../components/post/NewPost";
import ShowAllPosts from "../components/ShowAllPosts";
import usersContext from "../context/usersContext";
import SetImage from "../components/user/SetImage";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import Cookies from "js-cookie";
const FeedPage = () => {
  const data = useContext(usersContext);
  const navigate = useNavigate();
  useEffect(() => {
    !data.email && !Cookies.get("user") && navigate("/login");
  }, [data, navigate]);
  return (
    <>
      <Modal />
      {data.image && <SetImage />}
      {data.email && <NewPost />}
      <ShowAllPosts />
    </>
  );
};
export default FeedPage;
