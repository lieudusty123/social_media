import { useNavigate } from "react-router-dom";
import Modal from "../../reuseable/Modal/Modal";
import BackButton from "../../reuseable/BackButton/BackButton";
import styles from "./UserNotFound_Styling/UserNotFound.module.css";
const UserNotFound = () => {
  const navigate = useNavigate();
  return (
    <div id={styles["content_container"]}>
      <Modal />
      <div id={styles["status_code"]}>404</div>
      <h1 id={styles["title"]}>Woops!</h1>
      <div>
        We couldn't find the page you were looking for, but don't worry, we'll
        help you get back on track.
        <br />
        Please check the URL or try navigating from the home page.
      </div>
      <BackButton
        handleClick={() => {
          navigate("/");
        }}
      >
        Return
      </BackButton>
    </div>
  );
};
export default UserNotFound;
