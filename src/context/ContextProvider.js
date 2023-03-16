import axios from "axios";
import Cookies from "js-cookie";
import { useReducer } from "react";
import usersContext from "./usersContext";
const initialFluidData = {
  email: undefined,
  userName: undefined,
  userId: undefined,
  image: undefined,
};
function reducerFunc(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        email: action.email,
        userId: action.userId,
        userName: action.userName,
        image: action.image,
      };

    case "LOGOUT":
      Cookies.remove("user");
      axios.post("http://localhost:3000/update-user-time", {
        user: action.userId,
      });
      return {
        email: undefined,
        userId: undefined,
        userName: undefined,
        image: undefined,
      };
    case "IMAGE":
      return {
        email: action.email,
        userId: action.userId,
        userName: action.userName,
        image: action.image,
      };
    default:
      break;
  }
}
const ContextProvider = (props) => {
  const [fluidData, setFluidData] = useReducer(reducerFunc, initialFluidData);
  function onLogin(emailInput, id, name, image) {
    setFluidData({
      type: "LOGIN",
      email: emailInput,
      userId: id,
      userName: name,
      image: image,
    });
  }
  function onLogOut() {
    setFluidData({ type: "LOGOUT" });
  }
  function onChangeImage(emailInput, id, name, img) {
    setFluidData({
      type: "IMAGE",
      email: emailInput,
      userId: id,
      userName: name,
      image: img,
    });
  }
  const passedVal = {
    email: fluidData.email,
    userId: fluidData.userId,
    userName: fluidData.userName,
    image: fluidData.image,
    login: onLogin,
    logOut: onLogOut,
    changeImage: onChangeImage,
  };

  return (
    <usersContext.Provider value={passedVal}>
      {props.children}
    </usersContext.Provider>
  );
};

export default ContextProvider;
