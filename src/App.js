import axios from "axios";
import usersContext from "./context/usersContext";
import FeedPage from "./pages/FeedPage";
import UserProfile from "./pages/UserProfile";
import { useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { Route, Routes } from "react-router-dom";
import UserNotFound from "./pages/UserNotFound";
import Form from "./pages/Form";

function App() {
  const data = useContext(usersContext);
  // gets data from cookies and updating the contextAPI + fetching user image
  useEffect(() => {
    let cookiesStr = Cookies.get("user");
    if (
      cookiesStr !== undefined &&
      JSON.parse(cookiesStr).userId &&
      !data.email
    ) {
      let cookies = JSON.parse(cookiesStr);
      axios
        .post("/get-user-image", {
          id: cookies.userId,
        })
        .then((res) => {
          console.log(res);
          data.login(cookies.email, cookies.userId, cookies.userName, res.data);
        })
        .catch((e) => {
          alert(e.response.data);
        });
    }
  }, [data]);

  return (
    <Routes>
      <Route path="/" element={<FeedPage />} />

      <Route path="/login" element={<Form />} />
      <Route path="/signup" element={<Form />} />

      <Route path="/p/:id" element={<UserProfile />} />
      <Route path="/p/*" element={<UserNotFound />} />

      <Route path="/post/:id" element={<UserNotFound />} />
      <Route path="/post/*" element={<UserNotFound />} />

      <Route path="/*" element={<UserNotFound />} />
    </Routes>
  );
}

export default App;
