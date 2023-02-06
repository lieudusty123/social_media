import PostThumbnail from "./PostThumbnail";
import { v4 as uuidv4 } from "uuid";
import styles from "./style.module.css";

const AllPostsThumbnails = (props) => {
  const mappedItems = props.user.map((post) => {
    return <PostThumbnail post={post} key={uuidv4()} />;
  });
  return <section id={styles["posts_container"]}>{mappedItems}</section>;
};
export default AllPostsThumbnails;
