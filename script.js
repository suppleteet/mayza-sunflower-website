const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const yearTarget = document.querySelector("[data-year]");

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

if (navToggle && siteNav) {
  const closeNav = () => {
    document.body.classList.remove("nav-open");
    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNav();
    }
  });
}

const photoTiles = Array.from(document.querySelectorAll(".photo-tile"));
const lightbox = document.getElementById("lightbox");

if (photoTiles.length && lightbox) {
  const lightboxImage = lightbox.querySelector(".lightbox-image");
  const closeBtn = lightbox.querySelector(".lightbox-close");
  const prevBtn = lightbox.querySelector(".lightbox-prev");
  const nextBtn = lightbox.querySelector(".lightbox-next");
  let currentIndex = 0;
  let lastFocused = null;

  const show = (index) => {
    currentIndex = (index + photoTiles.length) % photoTiles.length;
    const img = photoTiles[currentIndex].querySelector("img");
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
  };

  const open = (index) => {
    lastFocused = document.activeElement;
    show(index);
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    closeBtn.focus();
  };

  const close = () => {
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    lightboxImage.src = "";
    if (lastFocused) {
      lastFocused.focus();
    }
  };

  photoTiles.forEach((tile, index) => {
    tile.addEventListener("click", () => open(index));
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => show(currentIndex - 1));
  nextBtn.addEventListener("click", () => show(currentIndex + 1));

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      close();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (lightbox.hidden) {
      return;
    }
    if (event.key === "Escape") {
      close();
    } else if (event.key === "ArrowLeft") {
      show(currentIndex - 1);
    } else if (event.key === "ArrowRight") {
      show(currentIndex + 1);
    }
  });
}
