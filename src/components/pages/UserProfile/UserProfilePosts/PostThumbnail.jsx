import PostThumbnailModal from "./PostModal/PostThumbnailModal";
import "./PostModal/postThumbnailModal_Styling/PostThumbnailModal_styling.module.css";
import { v4 as uuidv4 } from "uuid";
import { useState, useRef } from "react";

const PostThumbnail = (props) => {
  const [showModal, setShowModal] = useState(false);
  const postModalRef = useRef(document.querySelector("#post_modal"));

  function navOut() {
    setShowModal(false);
    document.querySelector("#post_modal").classList.remove("shown");
  }
  return (
    <>
      {" "}
      <div
        className="profile-page gallery-item"
        tabIndex="0"
        onClick={() => {
          setShowModal(true);
          postModalRef.current.classList.add("shown");
        }}
      >
        <img src={props.post.files[0]} className="profile-page gallery-image" alt="" />

        <div className="profile-page gallery-item-info">
          <ul>
            <li className="profile-page gallery-item-likes">
              <span className="profile-page visually-hidden">Likes:</span>
              <i className="profile-page fas fa-heart" aria-hidden="true"></i> {props.post.engagement.likes.length}
            </li>
            <li className="profile-page gallery-item-comments">
              <span className="profile-page visually-hidden">Comments:</span>
              <i className="profile-page fas fa-comment" aria-hidden="true"></i> {props.post.engagement.comments.length}
            </li>
          </ul>
        </div>
      </div>
      {showModal === true && (
        <PostThumbnailModal
          userImage={props.userImage}
          post={props.post}
          key={uuidv4()}
          postModalRef={navOut} // Pass the postModalRef to the child component
        />
      )}
    </>
  );
};
export default PostThumbnail;
