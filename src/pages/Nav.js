import axios from "axios";
import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/reuseable/BackButton/BackButton";
import { v4 as uuidv4 } from "uuid";
import "./nav_styling/Nav_styling.css";
import defaultImage from "../files/placeholder_user_image.webp";
import usersContext from "../context/usersContext";
const Nav = () => {
  const navigate = useNavigate();
  const [searchInputState, setSearchInputState] = useState("");
  const [autoComplete, setAutoComplete] = useState([]);
  const data = useContext(usersContext);
  const userOptionsRef = useRef();

  function fetchUserList(val) {
    if (val.length > 0) {
      axios
        .post("http://localhost:8000/search", {
          searchedInput: val,
        })
        .then((res) => {
          console.log(res.data);
          let tempArr = [];
          res.data.forEach((user) => {
            tempArr.push(
              <li
                onClick={() => {
                  setSearchInputState("");
                  setAutoComplete([]);
                  navigate(`/p/${user.uuid}`);
                }}
                onAuxClick={(e) => {
                  if (e.button === 1) {
                    setSearchInputState("");
                    setAutoComplete([]);
                    navigate(`/p/${user.uuid}`);
                  }
                }}
                key={uuidv4()}
              >
                <img
                  src={user.image === "default" ? defaultImage : user.image}
                  alt="new profile pic"
                />
                <div className="user-detail-wrapper">
                  <div className="user-name">{user.name}</div>
                  <div className="user-uuid">{user.uuid}</div>
                </div>
              </li>
            );
          });
          setAutoComplete(tempArr);
        });
    } else {
      setAutoComplete([]);
    }
  }

  function logout() {
    data.logOut();
  }

  return (
    <nav id="main_nav">
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
      <form>
        <input
          type="text"
          placeholder="Search"
          value={searchInputState}
          onChange={(e) => {
            setSearchInputState(e.target.value);
            fetchUserList(e.target.value);
          }}
        />
        <ul>{autoComplete}</ul>
      </form>
      <div
        className="user_image_container"
        onClick={() => userOptionsRef.current.classList.toggle("shown")}
      >
        <img
          src={data.image === "default" ? defaultImage : data.image}
          className="user_image"
          alt="current profile pic"
        />
        <form>
          <ul ref={userOptionsRef} className="user_option_ul">
            <li onClick={() => navigate(`/p/${data.userId}`)}>View Profile</li>
            <li onClick={logout}>Log out</li>
          </ul>
        </form>
      </div>
    </nav>
  );
};
export default Nav;
