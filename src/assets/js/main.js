import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import "./form-validation";
import "./gallery";

const nav = document.getElementById("main-menu");
const openClass = "c-navigation--open";
const closeClass = "c-navigation--close";

const swapOpenState = () => {
  if (!nav) return;
  if (nav.classList.contains(openClass)) {
    nav.classList.remove(openClass);
    nav.classList.add(closeClass);
    enableBodyScroll(nav);
  } else {
    nav.classList.add(openClass);
    nav.classList.remove(closeClass);
    disableBodyScroll(nav);
  }
};

const mainMenuToggle = document.getElementById("main-menu-toggle");
mainMenuToggle.addEventListener("click", swapOpenState);

let resizeTimeout;

const debounce = (func, delay) => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(func, delay);
};

// Check if on desktop view
const checkViewportSize = () => {
  if (window.innerWidth >= 768) {
    enableBodyScroll(document.getElementById("main-menu"));
    nav.classList.remove(closeClass);
    nav.classList.remove(openClass);
  }
};

window.addEventListener("resize", () => debounce(checkViewportSize, 600));
checkViewportSize(); // Trigger on initial page load
