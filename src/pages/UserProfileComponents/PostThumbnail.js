import PostThumbnailModal from "./PostModal/PostThumbnailModal";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";

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
    <div
      className="profile-page gallery-item"
      tabIndex="0"
      onClick={() => setShowModal((prev) => !prev)}
    >
      <img
        src={props.post.files[0]}
        className="profile-page gallery-image"
        alt=""
      />

      <div className="profile-page gallery-item-info">
        <ul>
          <li className="profile-page gallery-item-likes">
            <span className="profile-page visually-hidden">Likes:</span>
            <i
              className="profile-page fas fa-heart"
              aria-hidden="true"
            ></i>{" "}
            {props.post.engagement.likes.length}
          </li>
          <li className="profile-page gallery-item-comments">
            <span className="profile-page visually-hidden">Comments:</span>
            <i
              className="profile-page fas fa-comment"
              aria-hidden="true"
            ></i>{" "}
            {props.post.engagement.comments.length}
          </li>
        </ul>
      </div>
      {showModal && <PostThumbnailModal post={props.post} key={uuidv4()} />}
    </div>
  );
};
export default PostThumbnail;
