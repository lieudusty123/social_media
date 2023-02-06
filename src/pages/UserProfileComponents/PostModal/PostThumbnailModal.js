import { useEffect, useState } from "react";
import placeHolderUserImage from "../../../files/placeholder_user_image.webp";
import { v4 as uuidv4 } from "uuid";
import styles from "./PostThumbnailModal_styling.module.css";
import { createPortal } from "react-dom";
const PostThumbnailModal = (props) => {
  const [userImage, setUserImage] = useState();

  // map through the post's comments (with the usage of props) and returns an <li/> for each
  const commentsMap = props.post.engagement.comments.map((comment) => (
    <li key={uuidv4()}>
      <div className={styles["comment_name"]}>- {comment.userName}</div>
      <div className={styles["comment_content"]}>{comment.content}</div>
    </li>
  ));

  //when the component loads gets the create profile image from sessionStorage instead of fetching it
  useEffect(() => {
    setUserImage(sessionStorage.getItem("userProfileImage"));
  }, []);
  return createPortal(
    <div className={styles["post"]}>
      <div className={styles["post_info"]}>
        <div className={styles["post_info_header"]}>
          <div className={styles["user_image_container"]}>
            <img
              className={styles["user_image"]}
              src={userImage === "default" ? placeHolderUserImage : userImage}
              alt="user icon"
            />
            <div className={styles["user_name"]}>
              {props.post.userName.name}
            </div>
          </div>
          <div className={styles["section_title"]}>Description</div>
          <div className={styles["post_description"]}>{props.post.title}</div>
        </div>
        <div className={styles["comment_section_container"]}>
          <div className={styles["section_title"]}>Comments</div>
          <ul>{commentsMap}</ul>
          <form className={styles["post_comment"]}>
            <input type="text" />
            <button type="submit">Post</button>
          </form>
        </div>
      </div>
      <div className={styles["post_body"]}>
        <img src={props.post.files[0]} alt="uploaded post" />
        <button className={styles["like_button"]}>
          <img
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xMiAyMS41OTNjLTUuNjMtNS41MzktMTEtMTAuMjk3LTExLTE0LjQwMiAwLTMuNzkxIDMuMDY4LTUuMTkxIDUuMjgxLTUuMTkxIDEuMzEyIDAgNC4xNTEuNTAxIDUuNzE5IDQuNDU3IDEuNTktMy45NjggNC40NjQtNC40NDcgNS43MjYtNC40NDcgMi41NCAwIDUuMjc0IDEuNjIxIDUuMjc0IDUuMTgxIDAgNC4wNjktNS4xMzYgOC42MjUtMTEgMTQuNDAybTUuNzI2LTIwLjU4M2MtMi4yMDMgMC00LjQ0NiAxLjA0Mi01LjcyNiAzLjIzOC0xLjI4NS0yLjIwNi0zLjUyMi0zLjI0OC01LjcxOS0zLjI0OC0zLjE4MyAwLTYuMjgxIDIuMTg3LTYuMjgxIDYuMTkxIDAgNC42NjEgNS41NzEgOS40MjkgMTIgMTUuODA5IDYuNDMtNi4zOCAxMi0xMS4xNDggMTItMTUuODA5IDAtNC4wMTEtMy4wOTUtNi4xODEtNi4yNzQtNi4xODEiLz48L3N2Zz4="
            alt="like button"
          />
        </button>
        <div className={styles["divider"]}>
          <div className={styles["divider_line_container"]}>
            <div className={styles["divider_line"]}></div>
          </div>
          <div className={styles["divider_circle"]}></div>
          <div className={styles["divider_line_container"]}>
            <div className={styles["divider_line"]}></div>
          </div>
          <span></span>
        </div>
      </div>
      <div className={styles["post_footer"]}>
        <div className={styles["post_footer_more"]}></div>
      </div>
    </div>,
    document.getElementById("post_modal")
  );
};
export default PostThumbnailModal;
