import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import usersContext from "../context/usersContext";
import defaultImage from "../files/placeholder_user_image.webp";
import BackButton from "../components/reuseable/BackButton/BackButton";
import AllPostsThumbnails from "./UserProfileComponents/AllPostsThumbnail";
import "./UserProfile/UserProfile.css";
import "./feed_styling/feed.css";
import Nav from "./Nav";
function UserProfile() {
  const params = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [validUser, setValidUser] = useState(null);
  const [followButton, setFollowButton] = useState();
  const [userData, setUserData] = useState(null);
  const [postData, setPostData] = useState(null);
  const [followButtonStyle, setFollowButtonStyle] = useState("");
  const data = useContext(usersContext);

  //gets full user-profile data and display page
  useEffect(() => {
    axios
      .post("http://localhost:8000/user-profile", { id: params.id })
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
        sessionStorage.setItem("userProfileImage", res.data.userData[0].image);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setValidUser(false);
      });
  }, [params.id, data]);
  function follow() {
    axios
      .post("http://localhost:8000/follow", {
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
  return (
    <>
      {validUser && !isLoading && (
        <div className="user-profile-container" style={{ fontSize: "10px" }}>
          <Nav />
          <header>
            <div className="container">
              <div className="profile">
                <div className="profile-image">
                  <img
                    src={
                      userData.image === "default"
                        ? defaultImage
                        : userData.image
                    }
                    alt=""
                  />
                </div>

                <div className="profile-user-settings">
                  <h1 className="profile-user-name">{userData.uuid}</h1>

                  {userData.uuid === data.userId && (
                    <button className="profile-page btn profile-edit-btn">
                      Edit Profile
                    </button>
                  )}
                  {userData.uuid !== data.userId && followButton && (
                    <button
                      className="profile-page btn profile-edit-btn"
                      onClick={follow}
                      style={{
                        ...followButtonStyle,
                        color: "black",
                        border: "none",
                        padding: ".2rem 1.5rem",
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
                      posts
                    </li>
                    <li>
                      <span className="profile-stat-count">
                        {userData.followers.length}
                      </span>{" "}
                      followers
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
              <AllPostsThumbnails user={postData} />
              {isLoading && <div className="loader"></div>}
            </div>
          </main>
        </div>
      )}
      {isLoading && (
        <div id="skeleton_wrapper">
          <nav>
            <BackButton
              handleClick={() => {
                navigate("/");
              }}
              customStyle={{
                margin: "0",
              }}
            >
              Home
            </BackButton>
          </nav>
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
    </>
  );
}
export default UserProfile;
