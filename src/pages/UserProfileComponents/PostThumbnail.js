import PostThumbnailModal from "./PostModal/PostThumbnailModal";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import styles from "./style.module.css";

const PostThumbnail = (props) => {
  const [showModal, setShowModal] = useState(false);

  if (showModal) {
    const postModal = document.getElementById("post_modal");
    postModal.addEventListener("click", (e) => {
      if (e.target.id === "post_modal") {
        setShowModal(!postModal);
        postModal.style.display = "none";
      }
    });
    let styles = {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.637)",
      cursor: "pointer",
    };
    Object.assign(postModal.style, styles);
  }
  return (
    <>
      <div
        className={styles["posts_thumbnail"]}
        onClick={() => setShowModal((prev) => !prev)}
      >
        <img
          src={props.post.files[0]}
          style={{ width: "auto", height: "100%" }}
        />
      </div>
      {showModal && <PostThumbnailModal post={props.post} key={uuidv4()} />}
    </>
  );
};
export default PostThumbnail;
