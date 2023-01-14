import axios from "axios";
import usersContext from "./context/usersContext";
import FeedPage from "./pages/FeedPage";
import UserProfile from "./pages/UserProfile";
import LoginSignin from "./pages/LoginSignin";
import SignUp from "./pages/SignUp";
import { useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { Route, Routes } from "react-router-dom";
import UserNotFound from "./pages/UserNotFound";

function App() {
  const data = useContext(usersContext);
  // gets data from cookies and updating the contextAPI + fetching user image
  useEffect(() => {
    let cookiesStr = Cookies.get("user");
    if (cookiesStr && !data.email) {
      let cookies = JSON.parse(cookiesStr);
      axios
        .post("http://localhost:8000/get-user-image", { id: cookies.userId })
        .then((res) => {
          console.log(res);
          data.login(cookies.email, cookies.userId, cookies.userName, res.data);
        });
    }
  }, [data]);

  return (
    <Routes>
      <Route path="/" element={<FeedPage />} />
      <Route path="/login" element={<LoginSignin />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/p/:id" element={<UserProfile />} />
      <Route path="/*" element={<UserNotFound />} />
      <Route path="/p/*" element={<UserNotFound />} />
    </Routes>
  );
}

export default App;
