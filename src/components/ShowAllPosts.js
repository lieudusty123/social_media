import { Fragment, useContext, useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Post from "./post/Post";
import usersContext from "../context/usersContext";
import "./post_skeleton/post_skeleton.css";
const ShowAllPosts = () => {
  const [mappedItem, setMappedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const data = useContext(usersContext);

  useEffect(() => {
    document.querySelector("body").style.overflow = "hidden";
    axios
      .post("https://omerinstagram.netlify.app/all-posts", {
        currentUser: data.userId,
      })
      .then((res) => {
        let arr = [];
        res.data.forEach((post) => {
          arr.push(<Post data={post} key={uuidv4()} />);
        });
        setMappedItems(arr);
        setIsLoading(false);
        document.querySelector("body").style.overflow = "auto";
      });
  }, [data.userId]);

  return (
    <Fragment>
      {isLoading && (
        <div id="post_skeleton_container">
          <div className="loading-post">
            <div className="loading-post-header">
              <div className="loading-post-header-avatar"></div>
              <div className="loading-post-header-username"></div>
            </div>
            <div className="loading-post-image"></div>
            <div className="loading-post-likes"></div>
            <div className="loading-post-caption"></div>
            <div className="loading-post-time"></div>
            <div className="loading-post-button"></div>
          </div>
          <div className="loading-post">
            <div className="loading-post-header">
              <div className="loading-post-header-avatar"></div>
              <div className="loading-post-header-username"></div>
            </div>
            <div className="loading-post-image"></div>
            <div className="loading-post-likes"></div>
            <div className="loading-post-caption"></div>
            <div className="loading-post-time"></div>
            <div className="loading-post-button"></div>
          </div>
        </div>
      )}
      {isLoading === false && mappedItem}
    </Fragment>
  );
};

export default ShowAllPosts;
