import React, { useContext, useEffect, useState, useRef, lazy } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";

import usersContext from "../../../context/usersContext";
import AllPostsThumbnails from "./UserProfileComponents/AllPostsThumbnail";

import "./UserProfile_Styling/UserProfile.css";
import "../Feed/feed_styling/feed.css";
import UserProfileSkeleton from "./UserProfileSkeleton";
import ProfileHeader from "./UserProfileHeader/ProfileHeader";
const UserNotFound = lazy(() => import("../UserNotFound/UserNotFound"));
function UserProfile() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [validUser, setValidUser] = useState(null);

  const [userData, setUserData] = useState(null);
  const [postData, setPostData] = useState(null);

  const data = useContext(usersContext);

  //gets full user-profile data and display page
  useEffect(() => {
    axios
      .post("/user-profile", {
        id: params.id,
      })
      .then((res) => {
        setUserData(res.data.userData);
        setPostData(res.data.posts);
        setValidUser(true);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setValidUser(false);
      });
  }, [params.id, data]);

  return (
    <>
      {validUser && !isLoading && (
        <div className="user-profile-container" style={{ fontSize: "10px" }}>
          <ProfileHeader userData={userData} setUserData={setUserData} />
          <main>
            <div className="container">
              <AllPostsThumbnails user={postData} userImage={userData.image} />
              {isLoading && <div className="loader"></div>}
            </div>
          </main>
        </div>
      )}
      {isLoading && <UserProfileSkeleton />}
      {!validUser && !isLoading && <UserNotFound />}
    </>
  );
}
export default UserProfile;
