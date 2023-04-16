import { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import usersContext from "../../../context/usersContext";
import styles from "./PostThumbnailModal_styling.module.css";
import placeHolderUserImage from "../../../files/placeholder_user_image.webp";

let timeOut;
const PostThumbnailModal = (props) => {
  const [userImage, setUserImage] = useState();
  const data = useContext(usersContext);
  const navigate = useNavigate();
  //Comment Hooks
  const [commentContent, setCommentContent] = useState("");
  const addCommentRef = useRef();
  const [mappedComments, setMappedComments] = useState([]);
  // map through the post's comments (with the usage of props) and returns an <li/> for each

  const likeCounterRef = useRef();

  useEffect(() => {
    let localArr = props.post.engagement.comments.map((comment) => (
      <li key={uuidv4()}>
        <div
          className={styles["comment_name"]}
          onClick={() => {
            props.postModalRef();
            navigate(`/p/${comment.userId}`);
          }}
        >
          - {comment.userName}
        </div>
        <div className={styles["comment_content"]}>{comment.content}</div>
      </li>
    ));
    setUserImage(props.userImage);
    setMappedComments(localArr);
  }, [props, navigate]);
  useEffect(() => {
    const modalEle = document.querySelector("#post_modal");

    const handleClickOutside = (e) => {
      if (e.target.id === "post_modal") {
        props.postModalRef();
      }
    };

    modalEle.addEventListener("click", handleClickOutside);

    return () => {
      props.postModalRef();
      // Cleanup the event listener when the component unmounts
      modalEle.removeEventListener("click", handleClickOutside);
    };
  }, [props]);
  function sendNewComment(e) {
    e.preventDefault();
    if (data.userName && commentContent.length > 0) {
      let localArr = (
        <li key={uuidv4()}>
          <div
            className={styles["comment_name"]}
            onClick={() => {
              props.postModalRef();
              navigate(`/p/${data.userId}`);
            }}
          >
            - {data.userName}
          </div>
          <div className={styles["comment_content"]}>{commentContent}</div>
        </li>
      );
      setMappedComments((oldElements) => [...oldElements, localArr]);

      axios.post("/add-comment", {
        userId: data.userId,
        userName: data.userName,
        postId: props.post._id,
        content: commentContent,
      });
      setCommentContent("");
    } else {
    }
  }
  function submitLike() {
    if (timeOut) {
      clearTimeout(timeOut);
    }
    if (data.userId !== undefined) {
      if (
        +likeCounterRef.current.textContent ===
        props.post.engagement.likes.length
      ) {
        likeCounterRef.current.textContent =
          +likeCounterRef.current.textContent + 1;
        timeOut = setTimeout(() => axiosLike("ADD"), 500);
      } else {
        likeCounterRef.current.textContent =
          +likeCounterRef.current.textContent - 1;
        timeOut = setTimeout(() => axiosLike("REMOVE"), 500);
      }
    } else {
      alert("You need to login first");
    }
  }
  function axiosLike(str) {
    axios.post("/like-post", {
      userId: data.userId,
      postId: props.post._id,
      action: str,
    });
  }
  return createPortal(
    <div className={styles["post"]} id="post_thumbnail_modal_wrapper">
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
        <div
          className={styles["section_title"]}
          style={{
            padding: ".5rem .5rem 0 .5rem",
          }}
        >
          Likes{" ("}
          <span ref={likeCounterRef}>{props.post.engagement.likes.length}</span>
          {")"}
        </div>
        <div className={styles["comment_section_container"]}>
          <div className={styles["section_title"]}>
            Comments<span>{` (${props.post.engagement.comments.length})`}</span>
          </div>
          <ul>{mappedComments}</ul>
          <form className={styles["post_comment"]} onSubmit={sendNewComment}>
            <input
              placeholder="Comment..."
              onChange={(e) => setCommentContent(e.target.value)}
              value={commentContent}
              ref={addCommentRef}
            />
            <button type="submit">Post</button>
          </form>
        </div>
      </div>
      <div className={styles["post_body"]}>
        <img
          src={props.post.files[0]}
          alt="uploaded post"
          onDoubleClick={submitLike}
        />
      </div>
    </div>,
    document.getElementById("post_modal")
  );
};
export default PostThumbnailModal;
