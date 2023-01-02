import axios from "axios";
import { useRef, useState, useContext, useEffect } from "react";
import usersContext from "../../context/usersContext";
import { v4 as uuidv4 } from "uuid";
import defaultImage from "../../files/placeholder_user_image.webp";

import "./post_styling/post.css";
let timeOut;
const Post = (props) => {
  const likeButton = useRef();
  const likeRef = useRef();
  const commentList = useRef();
  const [commentContent, setCommentContent] = useState();
  const data = useContext(usersContext);
  const [mappedComments, setMappedComments] = useState([]);
  const [postedOn, setPostedOn] = useState("");
  const [isFullTitle, setIsFullTitle] = useState(false);
  function sendNewComment(e) {
    e.preventDefault();
    if (data.userName && commentContent.length > 0) {
      console.log(commentList.current);
      let localArr = (
        <li className="post_comment" key={uuidv4()}>
          <div>
            <div className="post_comment_name">{data.userName}</div>
            <div>{commentContent}</div>
          </div>
        </li>
      );
      setMappedComments((oldElements) => [...oldElements, localArr]);

      axios.post("http://localhost:8000/add-comment", {
        userId: data.userId,
        userName: data.userName,
        postId: props.data._id,
        content: commentContent,
      });
      setCommentContent("");
    } else {
      alert("you need to login dummy");
    }
  }
  function axiosLike(str) {
    axios.post("http://localhost:8000/like-post", {
      userId: data.userId,
      postId: props.data._id,
      action: str,
    });
    console.log("here");
  }
  function submitLike() {
    if (timeOut) {
      clearTimeout(timeOut);
    }
    if (data.userId !== undefined) {
      if (likeButton.current.className === "empty") {
        likeButton.current.src =
          "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgNC4yNDhjLTMuMTQ4LTUuNDAyLTEyLTMuODI1LTEyIDIuOTQ0IDAgNC42NjEgNS41NzEgOS40MjcgMTIgMTUuODA4IDYuNDMtNi4zODEgMTItMTEuMTQ3IDEyLTE1LjgwOCAwLTYuNzkyLTguODc1LTguMzA2LTEyLTIuOTQ0eiIvPjwvc3ZnPg==";
        likeButton.current.className = "full";
        likeRef.current.textContent = +likeRef.current.textContent + 1;
        timeOut = setTimeout(() => axiosLike("ADD"), 500);
      } else {
        likeButton.current.src =
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xMiAyMS41OTNjLTUuNjMtNS41MzktMTEtMTAuMjk3LTExLTE0LjQwMiAwLTMuNzkxIDMuMDY4LTUuMTkxIDUuMjgxLTUuMTkxIDEuMzEyIDAgNC4xNTEuNTAxIDUuNzE5IDQuNDU3IDEuNTktMy45NjggNC40NjQtNC40NDcgNS43MjYtNC40NDcgMi41NCAwIDUuMjc0IDEuNjIxIDUuMjc0IDUuMTgxIDAgNC4wNjktNS4xMzYgOC42MjUtMTEgMTQuNDAybTUuNzI2LTIwLjU4M2MtMi4yMDMgMC00LjQ0NiAxLjA0Mi01LjcyNiAzLjIzOC0xLjI4NS0yLjIwNi0zLjUyMi0zLjI0OC01LjcxOS0zLjI0OC0zLjE4MyAwLTYuMjgxIDIuMTg3LTYuMjgxIDYuMTkxIDAgNC42NjEgNS41NzEgOS40MjkgMTIgMTUuODA5IDYuNDMtNi4zOCAxMi0xMS4xNDggMTItMTUuODA5IDAtNC4wMTEtMy4wOTUtNi4xODEtNi4yNzQtNi4xODEiLz48L3N2Zz4=";
        likeButton.current.className = "empty";
        likeRef.current.textContent = +likeRef.current.textContent - 1;
        timeOut = setTimeout(() => axiosLike("REMOVE"), 500);
      }
    } else {
      alert("You need to login first");
    }
  }
  function passedTimeFormatted(date) {
    const curr = new Date();
    const difference = curr - date;
    const formatted = difference / (1000 * 60 * 60 * 24);
    const ronuded = Math.round(formatted);
    if (ronuded / 365 >= 1) {
      setPostedOn(`${(ronuded / 365).toFixed(1)}
      ${ronuded > 1 ? " years ago" : " year ago"}`);
    } else if (ronuded / 30 >= 1) {
      setPostedOn(`${(ronuded / 30).toFixed(1)}
      ${ronuded > 1 ? " months ago" : " month ago"}`);
    } else if (ronuded >= 1) {
      setPostedOn(`${ronuded}${ronuded > 1 ? " days ago" : " day ago"}`);
    } else {
      setPostedOn("today");
    }
  }
  useEffect(() => {
    let newDate = new Date(props.data.date);
    passedTimeFormatted(newDate);
    let localArr = props.data.engagement.comments.map((element) => (
      <li className="post_comment" key={uuidv4()}>
        <div>
          <div className="post_comment_name">{element.userName}</div>
          <div>{element.content}</div>
        </div>
      </li>
    ));
    setMappedComments(() => localArr);
  }, [props.data]);
  useEffect(() => {
    if (data.userId === undefined) {
      likeButton.current.className =
        props.data.engagement.likes.indexOf(data.userId) > -1
          ? "full"
          : "empty";
      likeButton.current.src =
        props.data.engagement.likes.indexOf(data.userId) > -1
          ? "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgNC4yNDhjLTMuMTQ4LTUuNDAyLTEyLTMuODI1LTEyIDIuOTQ0IDAgNC42NjEgNS41NzEgOS40MjcgMTIgMTUuODA4IDYuNDMtNi4zODEgMTItMTEuMTQ3IDEyLTE1LjgwOCAwLTYuNzkyLTguODc1LTguMzA2LTEyLTIuOTQ0eiIvPjwvc3ZnPg=="
          : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xMiAyMS41OTNjLTUuNjMtNS41MzktMTEtMTAuMjk3LTExLTE0LjQwMiAwLTMuNzkxIDMuMDY4LTUuMTkxIDUuMjgxLTUuMTkxIDEuMzEyIDAgNC4xNTEuNTAxIDUuNzE5IDQuNDU3IDEuNTktMy45NjggNC40NjQtNC40NDcgNS43MjYtNC40NDcgMi41NCAwIDUuMjc0IDEuNjIxIDUuMjc0IDUuMTgxIDAgNC4wNjktNS4xMzYgOC42MjUtMTEgMTQuNDAybTUuNzI2LTIwLjU4M2MtMi4yMDMgMC00LjQ0NiAxLjA0Mi01LjcyNiAzLjIzOC0xLjI4NS0yLjIwNi0zLjUyMi0zLjI0OC01LjcxOS0zLjI0OC0zLjE4MyAwLTYuMjgxIDIuMTg3LTYuMjgxIDYuMTkxIDAgNC42NjEgNS41NzEgOS40MjkgMTIgMTUuODA5IDYuNDMtNi4zOCAxMi0xMS4xNDggMTItMTUuODA5IDAtNC4wMTEtMy4wOTUtNi4xODEtNi4yNzQtNi4xODEiLz48L3N2Zz4=";
    }
  }, [data, props.data.engagement.likes]);
  return (
    <div className="post">
      <div className="post_header">
        <div className="post_header_content">
          <img
            className="post_header_image"
            alt="user icon"
            src={
              props.data.userName.image === "default"
                ? defaultImage
                : props.data.userName.image
            }
          />
          <div className="post_header_name">{props.data.userName.name}</div>
        </div>
      </div>
      <div className="post_body">
        <img
          src={props.data.files[0]}
          className="post_body_image"
          alt="post img"
          onDoubleClick={submitLike}
        />
        <img
          className="post_body_shadow"
          src={props.data.files[0]}
          alt="post shadow"
        />
        <div className="post_body_buttons_container">
          <div className="post_body_buttons">
            <button onClick={submitLike}>
              <img
                alt="like button"
                ref={likeButton}
                className={
                  props.data.engagement.likes.indexOf(data.userId) > -1
                    ? "full"
                    : "empty"
                }
                src={
                  props.data.engagement.likes.indexOf(data.userId) > -1
                    ? "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgNC4yNDhjLTMuMTQ4LTUuNDAyLTEyLTMuODI1LTEyIDIuOTQ0IDAgNC42NjEgNS41NzEgOS40MjcgMTIgMTUuODA4IDYuNDMtNi4zODEgMTItMTEuMTQ3IDEyLTE1LjgwOCAwLTYuNzkyLTguODc1LTguMzA2LTEyLTIuOTQ0eiIvPjwvc3ZnPg=="
                    : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xMiAyMS41OTNjLTUuNjMtNS41MzktMTEtMTAuMjk3LTExLTE0LjQwMiAwLTMuNzkxIDMuMDY4LTUuMTkxIDUuMjgxLTUuMTkxIDEuMzEyIDAgNC4xNTEuNTAxIDUuNzE5IDQuNDU3IDEuNTktMy45NjggNC40NjQtNC40NDcgNS43MjYtNC40NDcgMi41NCAwIDUuMjc0IDEuNjIxIDUuMjc0IDUuMTgxIDAgNC4wNjktNS4xMzYgOC42MjUtMTEgMTQuNDAybTUuNzI2LTIwLjU4M2MtMi4yMDMgMC00LjQ0NiAxLjA0Mi01LjcyNiAzLjIzOC0xLjI4NS0yLjIwNi0zLjUyMi0zLjI0OC01LjcxOS0zLjI0OC0zLjE4MyAwLTYuMjgxIDIuMTg3LTYuMjgxIDYuMTkxIDAgNC42NjEgNS41NzEgOS40MjkgMTIgMTUuODA5IDYuNDMtNi4zOCAxMi0xMS4xNDggMTItMTUuODA5IDAtNC4wMTEtMy4wOTUtNi4xODEtNi4yNzQtNi4xODEiLz48L3N2Zz4="
                }
              />
            </button>
            <div ref={likeRef}>{props.data.engagement.likes.length}</div>
          </div>
          <div className="post_body_buttons">
            <button>
              <img
                src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iOTYuMDAwMDAwcHQiIGhlaWdodD0iOTYuMDAwMDAwcHQiIHZpZXdCb3g9IjAgMCA5Ni4wMDAwMDAgOTYuMDAwMDAwIgogcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgbWVldCI+CjxtZXRhZGF0YT4KQ3JlYXRlZCBieSBwb3RyYWNlIDEuMTYsIHdyaXR0ZW4gYnkgUGV0ZXIgU2VsaW5nZXIgMjAwMS0yMDE5CjwvbWV0YWRhdGE+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLDk2LjAwMDAwMCkgc2NhbGUoMC4xMDAwMDAsLTAuMTAwMDAwKSIKZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIj4KPHBhdGggZD0iTTMzNSA4NzMgYy0xMjIgLTQ0IC0yMjcgLTEzOCAtMjY0IC0yMzggLTI5IC03NiAtMjkgLTE5NCAwIC0yNzAgMzAKLTgyIDExMiAtMTY2IDIwNiAtMjEyIDY5IC0zNCA4NSAtMzggMTc0IC00MSA1NSAtMyAxMTkgMSAxNDQgNyA0MiAxMCA0OSA5CjEwNSAtMTkgMzMgLTE2IDcxIC0zMCA4NiAtMzAgbDI3IDAgLTYgODEgLTcgODEgMzUgNDEgYzc1IDg3IDk4IDI0NCA1NCAzNjIKLTMwIDgyIC0xMTIgMTY2IC0yMDcgMjEyIC03MiAzNiAtODEgMzggLTE4NiA0MSAtODYgMiAtMTIyIC0yIC0xNjEgLTE1eiIvPgo8L2c+Cjwvc3ZnPgo="
                alt="comment"
              />
            </button>
            <div>{props.data.engagement.comments.length}</div>
          </div>
        </div>
        <div className="post_body_title">
          <div className="post_date">{postedOn}</div>
          <div
            onClick={(e) => {
              setIsFullTitle((oldState) => !oldState);
              if (isFullTitle) {
                e.target.style.whiteSpace = "nowrap";
                e.target.style.height = "1rem";
              } else {
                e.target.style.whiteSpace = "normal";
                e.target.style.height = "auto";
              }
            }}
          >
            <span>
              <b>{props.data.userName.name} </b>
              {props.data.title}
            </span>
          </div>
        </div>
      </div>
      {mappedComments.length > 0 && (
        <hr style={{ width: "calc(100% - 20px)", color: "rgb(6,6,6)" }} />
      )}
      <div className="post_footer">
        <ul className="post_comment_list" ref={commentList}>
          {mappedComments}
        </ul>
        <form onSubmit={sendNewComment} className="new_comment">
          <input
            placeholder="Add a comment..."
            onChange={(e) => setCommentContent(e.target.value)}
            value={commentContent}
          />
          <button type="submit">Post</button>
        </form>
      </div>
    </div>
  );
};
export default Post;
