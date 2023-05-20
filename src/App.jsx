import { Suspense, lazy, useContext, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import usersContext from "./context/usersContext";
import Loading from "./components/reuseable/Loading/Loading";
import Nav from "./components/reuseable/Nav/Nav";
const FeedPage = lazy(() => import("./components/pages/Feed/FeedPage"));
const UserProfile = lazy(() =>
  import("./components/pages/UserProfile/UserProfile")
);
const UserNotFound = lazy(() =>
  import("./components/pages/UserNotFound/UserNotFound")
);
const Form = lazy(() => import("./components/pages/Login/Form"));

function App() {
  const data = useContext(usersContext);
  // gets data from cookies and updating the contextAPI + fetching user image
  const location = useLocation();

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
          data.login(cookies.email, cookies.userId, cookies.userName, res.data);
        })
        .catch((e) => {
          alert(e.response.data);
        });
    }
  }, [data]);

  return (
    <Suspense fallback={<Loading />}>
      {location.pathname !== "/login" && location.pathname !== "/signup" && (
        <Nav />
      )}
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
    </Suspense>
  );
}

export default App;
