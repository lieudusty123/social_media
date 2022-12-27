import { createContext } from "react";

const usersContext = createContext({
  email: "",
  userId: "",
  userName: "",
  image: "",
  logOut: () => {},
  login: () => {},
});

export default usersContext;
