import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./pages/feed_styling/feed.css";
// import App from "./App";
import ContextProvider from "./context/ContextProvider";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import FeedPage from "./pages/FeedPage";
import LoginSignin from "./pages/LoginSignin";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ContextProvider>
      <LoginSignin />
      <FeedPage />
    </ContextProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
