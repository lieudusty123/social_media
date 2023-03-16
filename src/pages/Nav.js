import axios from "axios";
import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/reuseable/BackButton/BackButton";
import { v4 as uuidv4 } from "uuid";
import "./nav_styling/Nav_styling.css";
import defaultImage from "../files/placeholder_user_image.webp";
import usersContext from "../context/usersContext";

let interval;
const Nav = () => {
  const navigate = useNavigate();
  const [searchInputState, setSearchInputState] = useState("");
  const [autoComplete, setAutoComplete] = useState([]);
  const [navLoading, setNavLoading] = useState(false);
  const data = useContext(usersContext);
  const userOptionsRef = useRef();

  function fetchUserList(data) {
    clearInterval(interval);
    if (data.length > 0) {
      axios
        .post("https://social-media-g0nc.onrender.com/search", {
          searchedInput: data,
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
          setNavLoading(false);
        });
    } else {
      setAutoComplete([]);
    }
  }

  function refreshTimer(data) {
    if (interval) {
      clearInterval(interval);
    }
    if (!navLoading) {
      setNavLoading(true);
    }

    interval = setInterval(() => {
      fetchUserList(data);
    }, 500);
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
          placeholder="Search..."
          value={searchInputState}
          onChange={(e) => {
            setSearchInputState(e.target.value);
            refreshTimer(e.target.value);
          }}
        />
        {navLoading === false && (
          <ul
            style={{
              border: autoComplete.length === 0 && "none",
            }}
          >
            {autoComplete}
          </ul>
        )}
        {navLoading === true && searchInputState.length > 0 && (
          <ul className="skeleton-ul">
            <li className="skeleton-li">
              <div className="skeleton-li-image"></div>
              <div className="skeleton-li-info">
                <div className="skeleton-li-name"></div>
                <div className="skeleton-li-id"></div>
              </div>
            </li>
            <li className="skeleton-li">
              <div className="skeleton-li-image"></div>
              <div className="skeleton-li-info">
                <div className="skeleton-li-name"></div>
                <div className="skeleton-li-id"></div>
              </div>
            </li>
            <li className="skeleton-li">
              <div className="skeleton-li-image"></div>
              <div className="skeleton-li-info">
                <div className="skeleton-li-name"></div>
                <div className="skeleton-li-id"></div>
              </div>
            </li>
          </ul>
        )}
      </form>
      <div className="user_image_container">
        {data.image !== undefined && (
          <img
            onClick={() => userOptionsRef.current.classList.toggle("shown")}
            src={data.image === "default" ? defaultImage : data.image}
            className="user_image"
            alt="current profile pic"
          />
        )}
        <ul ref={userOptionsRef} className="user_option_ul">
          <li onClick={() => navigate(`/p/${data.userId}`)}>View Profile</li>
          <li onClick={logout}>Log out</li>
        </ul>
      </div>
    </nav>
  );
};
export default Nav;
