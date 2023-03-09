import { Fragment, useContext, useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Post from "./post/Post";
import usersContext from "../context/usersContext";

const ShowAllPosts = () => {
  let [mappedItem, setMappedItems] = useState([]);
  const data = useContext(usersContext);
  console.log(data);
  useEffect(() => {
    axios
      .post("http://localhost:8000/all-posts", { currentUser: data.userId })
      .then((res) => {
        let arr = [];
        console.log("this", res);
        res.data.forEach((post) => {
          arr.push(<Post data={post} key={uuidv4()} />);
        });
        setMappedItems(arr);
      });
  }, []);

  return <Fragment>{mappedItem}</Fragment>;
};

export default ShowAllPosts;
