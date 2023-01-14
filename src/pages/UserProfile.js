import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../components/Modal";
import UserNotFound from "./UserNotFound";
import defaultImage from "../files/placeholder_user_image.webp";
import BackButton from "../components/reuseable/BackButton/BackButton";
import "./UserProfile/UserProfile.css";
function UserProfile() {
  const params = useParams();
  const navigate = useNavigate();
  const [validUser, setValidUser] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  useEffect(() => {
    axios
      .post("http://localhost:8000/user-profile", { id: params.id })
      .then((data) => {
        setUserProfile(data.data);
        setValidUser("valid");
      })
      .catch((e) => {
        setValidUser("invalid");
      });
  }, [params.id]);
  return (
    <>
      <Modal />
      {validUser === "valid" && (
        <div
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
            src={
              userProfile.userData[0].image === "default"
                ? defaultImage
                : userProfile.userData[0].image
            }
          />
          <h1>{userProfile.userData[0].name}</h1>
          <BackButton
            handleClick={() => {
              navigate("/");
            }}
          >
            Return
          </BackButton>
        </div>
      )}
      {validUser === "invalid" && <UserNotFound />}
    </>
  );
}
export default UserProfile;
