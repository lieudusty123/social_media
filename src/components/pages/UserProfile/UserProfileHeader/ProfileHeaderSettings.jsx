import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import usersContext from "../../../../context/usersContext";

export default function ProfileHeaderSettings({ userData }) {
  const [followButton, setFollowButton] = useState();
  const [followButtonStyle, setFollowButtonStyle] = useState("");

  const data = useContext(usersContext);
  useEffect(() => {
    setFollowButton(() => {
      if (userData.uuid === data.userId) {
        return false;
      } else if (userData.followers.indexOf(data.userId) === -1) {
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
  }, []);

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
      });
  }
  return (
    <div className="profile-user-settings">
      <h1 className="profile-user-name">{userData.uuid}</h1>
      {data.userId && userData.uuid !== data.userId && followButton && (
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
  );
}
