import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import "./form-validation"
import "./gallery"

const swapOpenState = () => {
  const nav = document.getElementById('main-menu');

  if (!nav) return;
  const openClass = "c-navigation--open";
  const closeClass = "c-navigation--close";
  if (nav.classList.contains(openClass)) {
      nav.classList.remove(openClass);
      nav.classList.add(closeClass);
      enableBodyScroll(nav);
  }
  else {
      nav.classList.add(openClass);
      nav.classList.remove(closeClass);
      disableBodyScroll(nav);
  }
}

const mainMenuToggle = document.getElementById("main-menu-toggle");
mainMenuToggle.addEventListener("click", swapOpenState);