import styles from "./BackButton.module.css";
const BackButton = (props) => {
  return (
    <button className={styles["button"]} onClick={props.handleClick}>
      {props.children}
    </button>
  );
};
export default BackButton;
