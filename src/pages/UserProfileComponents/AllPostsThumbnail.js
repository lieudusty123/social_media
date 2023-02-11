import PostThumbnail from "./PostThumbnail";
import { v4 as uuidv4 } from "uuid";

const AllPostsThumbnails = (props) => {
  const mappedItems = props.user.map((post) => {
    return <PostThumbnail post={post} key={uuidv4()} />;
  });

  return <div className="gallery">{mappedItems}</div>;
};
export default AllPostsThumbnails;
