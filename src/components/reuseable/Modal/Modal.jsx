import { createPortal } from "react-dom";
import "./modal_styling/modal.css";
import cookieImg from "../../../files/cookies.png";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
function Modal() {
  const [isShown, setIsShown] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("cookieConesnt") || Cookies.get("cookieConsent")) {
      document.getElementById("cookies_modal").style.display = "none";
      document.querySelector("body").style.overflow = "auto";
      setIsShown(false);
    } else {
      document.querySelector("body").style.overflow = "hidden";
      document.getElementById("cookies_modal").style.display = "flex";
      setIsShown(true);
    }
  }, []);
  function handleClick(e) {
    setIsShown((prev) => !prev);
    document.getElementById("cookies_modal").style.display = "none";
    document.querySelector("body").style.overflow = "auto";
    if (e.target.innerText === "Accept") {
      localStorage.setItem("cookieConsent", "true");
      Cookies.set("cookieConsent", "true");
    } else {
      localStorage.setItem("cookieConsent", "false");
    }
  }
  return createPortal(
    isShown && (
      <div id="cookie_consent_container">
        <img src={cookieImg} alt="cookie" />
        <h1>Allow Cookies</h1>
        <div>
          This website uses essential cookies to ensure you get the best
          experience. We take your privacy seriously and only collect the
          necessary cookies.
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
