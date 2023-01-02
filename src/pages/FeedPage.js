import NewPost from "../components/post/NewPost";
import ShowAllPosts from "../components/ShowAllPosts";
import usersContext from "../context/usersContext";
import { useContext } from "react";

const FeedPage = () => {
  const data = useContext(usersContext);
  return (
    <>
      {data.email && <NewPost />}
      <ShowAllPosts />
    </>
  );
};
export default FeedPage;
