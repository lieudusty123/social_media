import { createPortal } from "react-dom";
import "./modal_styling/modal.css";
import cookieImg from "../files/cookies.png";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
function Modal() {
  const [isShown, setIsShown] = useState(true);
  useEffect(() => {
    if (sessionStorage.getItem("cookieConesnt") || Cookies.get("user")) {
      console.log("in");
      document.getElementById("cookies_modal").style.display = "none";
      document.querySelector("body").style.overflow = "auto";
      setIsShown(false);
    } else {
      document.querySelector("body").style.overflow = "hidden";
    }
  }, []);
  function handleClick(e) {
    setIsShown((prev) => !prev);
    document.getElementById("cookies_modal").style.display = "none";
    document.querySelector("body").style.overflow = "auto";
    if (e.target.innerText === "Accept") {
      console.log("accepted");
      sessionStorage.setItem("cookieConsent", "true");
    } else {
      console.log("declined");
      sessionStorage.setItem("cookieConsent", "false");
    }
  }
  return createPortal(
    isShown && (
      <div id="cookie_consent_container">
        <img src={cookieImg} alt="cookie" />
        <h1>Allow Cookies</h1>
        <div>
          This website uses essential cookies to ensure you get the best
          experience on our website.
        </div>
        <div>
          <button id="accept" onClick={handleClick}>
            Accept
          </button>
          <button id="decline" onClick={handleClick}>
            Decline
          </button>
        </div>
      </div>
    ),
    document.getElementById("cookies_modal")
  );
}
export default Modal;
