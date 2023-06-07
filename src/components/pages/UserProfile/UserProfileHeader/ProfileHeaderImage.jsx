import React, { useState, useRef, useContext } from "react";
import defaultImage from "../../../../files/placeholder_user_image.webp";
import axios from "axios";
import usersContext from "../../../../context/usersContext";
export default function ProfileHeaderImage({ userData }) {
  const data = useContext(usersContext);
  const [showChangeButtons, setShowChangeButtons] = useState(false);
  const cameraIconRef = useRef();
  const profileImageRef = useRef();
  const changeImageRef = useRef();

  function setImageChange() {
    profileImageRef.current.src = URL.createObjectURL(changeImageRef.current["files"][0]);
    setShowChangeButtons(true);
  }
  function cancelImageChange() {
    profileImageRef.current.src = userData.image === "default" ? defaultImage : userData.image;
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
          setShowChangeButtons(false);
          data.changeImage(data.email, data.userId, data.userName, passedStr);
        });
    };
  }
  return (
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
              ref={profileImageRef}
              src={userData.image === "default" ? defaultImage : userData.image}
              alt={userData.uuid}
              onMouseEnter={() => {
                cameraIconRef.current.style.display = "block";
                profileImageRef.current.style.filter = "brightness(0.75)";
              }}
              onMouseLeave={() => {
                cameraIconRef.current.style.display = "none";
                profileImageRef.current.style.filter = "brightness(1)";
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
                profileImageRef.current.style.filter = "brightness(0.75)";
              }}
              onMouseLeave={() => {
                cameraIconRef.current.style.display = "none";
                profileImageRef.current.style.filter = "brightness(1)";
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
              ref={profileImageRef}
              src={userData.image === "default" ? defaultImage : userData.image}
              alt={userData.uuid}
            />
          </div>
        </>
      )}
    </div>
  );
}
