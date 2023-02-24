import { useContext, useRef, useState } from "react";
import defaultUserImage from "../../files/placeholder_user_image.webp";
import usersContext from "../../context/usersContext";
import axios from "axios";
const SetImage = () => {
  const fileRef = useRef();
  const data = useContext(usersContext);
  const [disableInput, setDisableInput] = useState(true);
  const currentImageRef = useRef();
  function changeIcon(e) {
    e.preventDefault();
    let passedStr = "";
    let reader = new FileReader();
    reader.readAsDataURL(fileRef.current["files"][0]);
    reader.onload = function () {
      passedStr = reader.result;
      axios
        .post("http://localhost:8000/change-icon", {
          userId: data.userId,
          image: passedStr,
        })
        .then(() => {
          fileRef.current.value = null;
          console.log("image was changed");
        });
    };
  }
  function displayCurrentSelectedImage() {
    console.log(currentImageRef.current);
    currentImageRef.current.src = URL.createObjectURL(
      fileRef.current["files"][0]
    );
    setDisableInput(false);
  }
  return (
    <form
      onSubmit={changeIcon}
      style={{ background: "rgb(50,50,60)", padding: "1rem", margin: "1rem" }}
    >
      <div>Change Icon</div>
      <img
        ref={currentImageRef}
        alt="current user img"
        src={data.image === "default" ? defaultUserImage : data.image}
        style={{ width: "50px", borderRadius: "50%" }}
      />
      <input type="file" ref={fileRef} onChange={displayCurrentSelectedImage} />
      <button type="submit" disabled={disableInput}>
        Change Image
      </button>
    </form>
  );
};
export default SetImage;
