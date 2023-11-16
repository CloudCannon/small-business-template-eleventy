import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import "./form-validation"
import "./gallery"

const swapOpenState = () => {
  const nav = document.getElementById('main-menu');

  if (!nav) return;
  const openClass = "c-navigation--open";
  if (nav.classList.contains(openClass)) {
      nav.classList.remove(openClass);
      enableBodyScroll(nav);
  }
  else {
      nav.classList.add(openClass);
      disableBodyScroll(nav);
  }
}

const manMenuToggle = document.getElementById("main-menu-toggle");
manMenuToggle.addEventListener("click", swapOpenState);