function hidePreloader() {
  const preloader = document.getElementById('preloader');
  const app = document.getElementById('app');
  app.hidden = false;
  preloader.classList.add('fade');
  preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
}
  window.addEventListener("load", () => {
  setTimeout(hidePreloader, 200); 
});