import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Post from "./post/Post";

const ShowAllPosts = () => {
  let [mappedItem, setMappedItems] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:8000/all-posts").then((res) => {
      console.log(res.data);
      let arr = [];
      res.data.forEach((post) => {
        console.log(post);
        arr.push(<Post data={post} key={uuidv4()} />);
      });
      setMappedItems(arr);
    });
  }, []);

  return (
    <Fragment>
      {/* <button onClick={fetchAllPosts}>fetchAllPosts</button> */}
      {mappedItem}
    </Fragment>
  );
};

export default ShowAllPosts;
