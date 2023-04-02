import { useState, useContext, useRef } from "react";
import axios from "axios";
import usersContext from "../../context/usersContext";
import "./new_post_styling/new_post.css";
import newPostImage from "../../files/new_post.png";
import placeHolderPostImage from "../../files/placeholder_new_post_image.jpg";
import defaultImage from "../../files/placeholder_user_image.webp";
const NewPost = () => {
  const [isShown, setIsShown] = useState(false);
  const [textData, setTextData] = useState("");
  const [displayedImage, setDisplayedImage] = useState(placeHolderPostImage);
  const data = useContext(usersContext);
  const imageRef = useRef();
  async function handleNewPostSubmit(e) {
    e.preventDefault();
    if (imageRef.current["files"][0] && textData.length > 0) {
      axios
        .post("/new-post", {
          userId: data.userId,
          image: displayedImage,
          title: textData,
        })
        .then(() => {
          imageRef.current.value = null;
          setTextData("");
          setIsShown((oldState) => !oldState);
        })
        .finally(() => {
          window.location.reload(false);
        });
    } else {
      alert("missing data!");
    }
  }

  function displayCurrentImage() {
    let reader = new FileReader();
    reader.readAsDataURL(imageRef.current["files"][0]);
    reader.onload = function () {
      setDisplayedImage(reader.result);
    };
  }

  return (
    <div id="new_post_container">
      <div
        id="new_post_button"
        onClick={() => {
          setIsShown((oldState) => !oldState);
        }}
      >
        <img src={newPostImage} alt="create post!" />
      </div>
      {isShown && (
        <form
          onSubmit={handleNewPostSubmit}
          className="new_post_modal"
          onClick={(e) => {
            if (e.target.className === "new_post_modal") {
              setIsShown((oldState) => !oldState);
            }
          }}
        >
          <div id="create_post_title">Create a new post</div>
          <div className="post">
            <div className="post_header">
              <div className="post_header_content">
                <img
                  className="post_header_image"
                  alt="user icon"
                  src={data.image === "default" ? defaultImage : data.image}
                />
                <div className="post_header_name">{data.userName}</div>
              </div>
            </div>
            <div className="post_body">
              <label htmlFor="file-input">
                <img
                  src={displayedImage}
                  className="post_body_image"
                  alt="post img"
                />
              </label>
              <img
                className="post_body_shadow"
                src={displayedImage}
                alt="post shadow"
              />
              <div className="post_body_buttons_container">
                <div className="post_body_buttons">
                  <button>
                    <img
                      alt="like button"
                      className="empty"
                      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xMiAyMS41OTNjLTUuNjMtNS41MzktMTEtMTAuMjk3LTExLTE0LjQwMiAwLTMuNzkxIDMuMDY4LTUuMTkxIDUuMjgxLTUuMTkxIDEuMzEyIDAgNC4xNTEuNTAxIDUuNzE5IDQuNDU3IDEuNTktMy45NjggNC40NjQtNC40NDcgNS43MjYtNC40NDcgMi41NCAwIDUuMjc0IDEuNjIxIDUuMjc0IDUuMTgxIDAgNC4wNjktNS4xMzYgOC42MjUtMTEgMTQuNDAybTUuNzI2LTIwLjU4M2MtMi4yMDMgMC00LjQ0NiAxLjA0Mi01LjcyNiAzLjIzOC0xLjI4NS0yLjIwNi0zLjUyMi0zLjI0OC01LjcxOS0zLjI0OC0zLjE4MyAwLTYuMjgxIDIuMTg3LTYuMjgxIDYuMTkxIDAgNC42NjEgNS41NzEgOS40MjkgMTIgMTUuODA5IDYuNDMtNi4zOCAxMi0xMS4xNDggMTItMTUuODA5IDAtNC4wMTEtMy4wOTUtNi4xODEtNi4yNzQtNi4xODEiLz48L3N2Zz4="
                    />
                  </button>
                  <div>0</div>
                </div>
                <div className="post_body_buttons">
                  <button>
                    <img
                      src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iOTYuMDAwMDAwcHQiIGhlaWdodD0iOTYuMDAwMDAwcHQiIHZpZXdCb3g9IjAgMCA5Ni4wMDAwMDAgOTYuMDAwMDAwIgogcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgbWVldCI+CjxtZXRhZGF0YT4KQ3JlYXRlZCBieSBwb3RyYWNlIDEuMTYsIHdyaXR0ZW4gYnkgUGV0ZXIgU2VsaW5nZXIgMjAwMS0yMDE5CjwvbWV0YWRhdGE+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLDk2LjAwMDAwMCkgc2NhbGUoMC4xMDAwMDAsLTAuMTAwMDAwKSIKZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIj4KPHBhdGggZD0iTTMzNSA4NzMgYy0xMjIgLTQ0IC0yMjcgLTEzOCAtMjY0IC0yMzggLTI5IC03NiAtMjkgLTE5NCAwIC0yNzAgMzAKLTgyIDExMiAtMTY2IDIwNiAtMjEyIDY5IC0zNCA4NSAtMzggMTc0IC00MSA1NSAtMyAxMTkgMSAxNDQgNyA0MiAxMCA0OSA5CjEwNSAtMTkgMzMgLTE2IDcxIC0zMCA4NiAtMzAgbDI3IDAgLTYgODEgLTcgODEgMzUgNDEgYzc1IDg3IDk4IDI0NCA1NCAzNjIKLTMwIDgyIC0xMTIgMTY2IC0yMDcgMjEyIC03MiAzNiAtODEgMzggLTE4NiA0MSAtODYgMiAtMTIyIC0yIC0xNjEgLTE1eiIvPgo8L2c+Cjwvc3ZnPgo="
                      alt="comment"
                    />
                  </button>
                  <div>0</div>
                </div>
              </div>
              <div className="post_body_title">
                <div className="post_date">now</div>
                <div style={{ whiteSpace: "normal", height: "auto" }}>
                  <div style={{ width: "100%" }}>
                    <b>{data.userName} </b>
                    <input
                      type="text"
                      placeholder="Description..."
                      value={textData}
                      style={{ width: "max-content" }}
                      onChange={(e) => setTextData(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <input
            style={{ display: "none" }}
            type="file"
            id="file-input"
            onChange={displayCurrentImage}
            ref={imageRef}
            accept="image/png, image/jpeg"
          />
          <button id="submitPost" type="submit">
            Submit Post
          </button>
        </form>
      )}
    </div>
  );
};
export default NewPost;
