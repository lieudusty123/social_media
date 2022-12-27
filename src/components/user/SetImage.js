import { useContext, useRef } from "react";
import defaultUserImage from "../../files/placeholder_user_image.webp";
import usersContext from "../../context/usersContext";
import axios from "axios";

const SetImage = () => {
  const fileRef = useRef();
  const data = useContext(usersContext);
  //   const [bool, setBool] = useState();
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
  console.log(fileRef.current);

  return (
    <>
      <form
        onSubmit={changeIcon}
        style={{ background: "rgb(50,50,60)", padding: "1rem", margin: "1rem" }}
      >
        <div>Change Icon</div>
        <img
          alt="current user img"
          src={data.image === "default" ? defaultUserImage : data.image}
          style={{ width: "50px", borderRadius: "50%" }}
        />
        <input type="file" ref={fileRef} />
        <button type="submit" disabled={fileRef.current}>
          Change Image
        </button>
      </form>
      {/* <button onClick={setBool(!bool)}>Re render components</button> */}
    </>
  );
};
export default SetImage;
