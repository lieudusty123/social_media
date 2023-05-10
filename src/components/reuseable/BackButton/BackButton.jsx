import styles from "./BackButton.module.css";
const BackButton = (props) => {
  return (
    <button
      className={styles["button"]}
      style={props.customStyle}
      onClick={props.handleClick}
    >
      {props.children}
    </button>
  );
};
export default BackButton;
