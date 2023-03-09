import { createContext } from "react";

const usersContext = createContext({
  email: "",
  userId: "",
  userName: "",
  image: "",
  logOut: () => {},
  login: () => {},
  changeImage: () => {},
});

export default usersContext;
