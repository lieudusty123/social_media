import React, { useContext, useEffect, useState, useRef, lazy } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";

import usersContext from "../../../context/usersContext";
import AllPostsThumbnails from "./UserProfileComponents/AllPostsThumbnail";

import "./UserProfile_Styling/UserProfile.css";
import "../Feed/feed_styling/feed.css";
const defaultImage = lazy(() =>
  import("../../../files/placeholder_user_image.webp")
);
const UserNotFound = lazy(() => import("../UserNotFound/UserNotFound"));
function UserProfile() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [validUser, setValidUser] = useState(null);
  const [followButton, setFollowButton] = useState();
  const [showChangeButtons, setShowChangeButtons] = useState(false);
  const [userData, setUserData] = useState(null);
  const [postData, setPostData] = useState(null);
  const [followButtonStyle, setFollowButtonStyle] = useState("");
  const data = useContext(usersContext);
  const cameraIconRef = useRef();
  const profileImage = useRef();
  const changeImageRef = useRef();
  //gets full user-profile data and display page
  console.log("here");
  useEffect(() => {
    axios
      .post("/user-profile", {
        id: params.id,
      })
      .then((res) => {
        setUserData(res.data.userData[0]);
        setPostData(res.data.posts);
        setFollowButton(() => {
          if (res.data.userData[0].uuid === data.userId) {
            return false;
          } else if (
            res.data.userData[0].followers.indexOf(data.userId) === -1
          ) {
            setFollowButtonStyle({
              backgroundColor: "#8AC3F2",
              color: "black",
            });
            return "follow";
          } else {
            setFollowButtonStyle({ backgroundColor: "white", color: "black" });
            return "following";
          }
        });
        setValidUser(true);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setValidUser(false);
      });
  }, [params.id, data]);

  function follow() {
    axios
      .post("/follow", {
        targetUuid: userData.uuid,
        currentUuid: data.userId,
      })
      .then(() => {
        setFollowButton((prev) => {
          switch (prev) {
            case "follow":
              setFollowButtonStyle({
                backgroundColor: "white",
                color: "black",
              });
              return "following";
            case "following":
              setFollowButtonStyle({
                backgroundColor: "#8AC3F2",
                color: "black",
              });
              return "follow";
            default:
              return false;
          }
        });
        console.log("done");
      });
  }
  function setImageChange() {
    profileImage.current.src = URL.createObjectURL(
      changeImageRef.current["files"][0]
    );
    setShowChangeButtons(true);
  }
  function cancelImageChange() {
    profileImage.current.src =
      userData.image === "default" ? defaultImage : userData.image;
    setShowChangeButtons(false);
  }
  function changeIcon() {
    let passedStr = "";
    let reader = new FileReader();
    reader.readAsDataURL(changeImageRef.current["files"][0]);
    reader.onload = function () {
      passedStr = reader.result;
      axios
        .post("/change-icon", {
          userId: data.userId,
          image: passedStr,
        })
        .then(() => {
          changeImageRef.current.value = null;
          console.log("image was changed");
          setShowChangeButtons(false);
          data.changeImage(data.email, data.userId, data.userName, passedStr);
        });
    };
  }
  return (
    <>
      {validUser && !isLoading && (
        <div className="user-profile-container" style={{ fontSize: "10px" }}>
          <header>
            <div className="container">
              <div className="profile">
                <div
                  className="profile-image"
                  style={{
                    position: "relative",
                  }}
                >
                  {data.userId === userData.uuid && (
                    <>
                      {" "}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          position: "relative",
                        }}
                      >
                        <img
                          ref={profileImage}
                          src={
                            userData.image === "default"
                              ? defaultImage
                              : userData.image
                          }
                          alt=""
                          onMouseEnter={() => {
                            cameraIconRef.current.style.display = "block";
                            profileImage.current.style.filter =
                              "brightness(0.75)";
                          }}
                          onMouseLeave={() => {
                            cameraIconRef.current.style.display = "none";
                            profileImage.current.style.filter = "brightness(1)";
                          }}
                        />
                        {showChangeButtons && (
                          <div
                            style={{
                              position: "absolute",
                              top: "105%",
                            }}
                          >
                            <button onClick={cancelImageChange}>Cancel</button>
                            <button onClick={changeIcon}>Change</button>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        ref={changeImageRef}
                        id="changeImage"
                        style={{ display: "none" }}
                        onChange={setImageChange}
                      />
                      <label
                        htmlFor="changeImage"
                        style={{
                          position: "absolute",
                          textAlign: "center",
                          width: "100%",
                        }}
                      >
                        <i
                          className="fa fa-camera camera_icon"
                          ref={cameraIconRef}
                          aria-hidden="true"
                          style={{
                            cursor: "pointer",
                            display: "none",
                            color: "#eee",
                            textShadow: "0 0 5px black",
                          }}
                          onMouseEnter={() => {
                            cameraIconRef.current.style.display = "block";
                            profileImage.current.style.filter =
                              "brightness(0.75)";
                          }}
                          onMouseLeave={() => {
                            cameraIconRef.current.style.display = "none";
                            profileImage.current.style.filter = "brightness(1)";
                          }}
                        ></i>
                      </label>
                    </>
                  )}
                  {data.userId !== userData.uuid && (
                    <>
                      {" "}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          position: "relative",
                        }}
                      >
                        <img
                          ref={profileImage}
                          src={
                            userData.image === "default"
                              ? defaultImage
                              : userData.image
                          }
                          alt=""
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="profile-user-settings">
                  <h1 className="profile-user-name">{userData.uuid}</h1>

                  {userData.uuid === data.userId && (
                    <button className="profile-page btn profile-edit-btn">
                      Edit
                    </button>
                  )}
                  {userData.uuid !== data.userId && followButton && (
                    <button
                      className="profile-page btn profile-edit-btn"
                      onClick={follow}
                      style={{
                        ...followButtonStyle,
                        fontSize: "14px",
                        fontWeight: "600",
                        lineHeight: "1.8",
                        border: "1px solid #dbdbdb",
                        borderRadius: "3px",
                        padding: "0 24px",
                        marginLeft: "20px",
                        color: "black",
                      }}
                    >
                      {followButton}
                    </button>
                  )}
                </div>

                <div className="profile-stats">
                  <ul>
                    <li>
                      <span className="profile-stat-count">
                        {userData.posts.length}
                      </span>{" "}
                      post{userData.posts.length > 1 && "s"}
                    </li>
                    <li>
                      <span className="profile-stat-count">
                        {userData.followers.length}
                      </span>{" "}
                      follower{userData.followers.length > 1 && "s"}
                    </li>
                    <li>
                      <span className="profile-stat-count">
                        {userData.following.length}
                      </span>{" "}
                      following
                    </li>
                  </ul>
                </div>

                <div className="profile-bio">
                  <p>
                    <span className="profile-real-name">{userData.name}</span>{" "}
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit
                    📷✈️🏕️
                  </p>
                </div>
              </div>
            </div>
          </header>

          <main>
            <div className="container">
              <AllPostsThumbnails user={postData} userImage={userData.image} />
              {isLoading && <div className="loader"></div>}
            </div>
          </main>
        </div>
      )}
      {isLoading && (
        <div id="skeleton_wrapper">
          {/* <Nav /> */}
          <header id="skeleton_header">
            <div id="skeleton_profile_image"></div>
            <div id="skeleton_profile_info_container">
              <div id="skeleton_profile_id"></div>
              <div id="skeleton_profile_stats">
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div id="skeleton_profile_bio">
                <div></div>
                <div></div>
              </div>
            </div>
          </header>
          <main id="skeleton_posts_wrapper">
            <div id="skeleton_posts_container">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </main>
        </div>
      )}
      {!validUser && !isLoading && <UserNotFound />}
    </>
  );
}
export default UserProfile;
