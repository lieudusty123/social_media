import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import usersContext from "../context/usersContext";
import UserNotFound from "./UserNotFound";
import defaultImage from "../files/placeholder_user_image.webp";
import BackButton from "../components/reuseable/BackButton/BackButton";
import "./UserProfile/UserProfile.css";
import UserProfileStyling from "./UserProfileComponents/style.module.css";
import AllPostsThumbnails from "./UserProfileComponents/AllPostsThumbnail";
function UserProfile() {
  const params = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [validUser, setValidUser] = useState(null);
  const [followButton, setFollowButton] = useState();
  const [userData, setUserData] = useState(null);
  const [postData, setPostData] = useState(null);
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
            return "follow";
          } else {
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
              return "following";
            case "following":
              return "follow";
            default:
              return false;
          }
        });
      });
  }
  return (
    <>
      {validUser && !isLoading && (
        <div id={UserProfileStyling["user_wrapper"]}>
          <section
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              color: "white",
            }}
          >
            <img
              style={{ width: "200px", height: "200px", borderRadius: "50%" }}
              alt="profile pic"
              src={userData.image === "default" ? defaultImage : userData.image}
            />
            <h1>{userData.name}</h1>
            <div>followers: {userData.followers.length}</div>
            <div>following: {userData.following.length}</div>

            {followButton && <button onClick={follow}>{followButton}</button>}

            <BackButton
              handleClick={() => {
                navigate("/");
              }}
            >
              Return
            </BackButton>
          </section>
          <AllPostsThumbnails user={postData} />
        </div>
      )}
      {!validUser && !isLoading && <UserNotFound />}
      {isLoading && <div>Loading.................</div>}
    </>
  );
}
export default UserProfile;
