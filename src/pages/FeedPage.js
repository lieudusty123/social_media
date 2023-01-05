import NewPost from "../components/post/NewPost";
import ShowAllPosts from "../components/ShowAllPosts";
import usersContext from "../context/usersContext";
import { useContext, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const FeedPage = () => {
  const data = useContext(usersContext);
  useEffect(() => {
    let cookiesStr = Cookies.get("user");
    if (cookiesStr && !data.email) {
      let cookies = JSON.parse(cookiesStr);
      axios
        .post("http://localhost:8000/get-user-image", { id: cookies.userId })
        .then((res) => {
          data.login(
            cookies.email,
            cookies.userId,
            cookies.userName,
            res.data.image
          );
        });
    }
  }, [data]);

  return (
    <>
      {data.email && <NewPost />}
      <ShowAllPosts />
    </>
  );
};
export default FeedPage;
