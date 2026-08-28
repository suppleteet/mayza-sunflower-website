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

const emailForm = document.querySelector("[data-email-form]");

if (emailForm) {
  const mayzaEmail = "mayza@sunflowergardennursery.com";
  const emailStatus = emailForm.querySelector("[data-email-status]");
  const emailFallback = emailForm.querySelector("[data-email-fallback]");
  const fallbackText = emailForm.querySelector("[data-email-fallback-text]");
  const copyButton = emailForm.querySelector("[data-email-copy]");
  const fallbackToggle = emailForm.querySelector("[data-email-fallback-toggle]");

  const revealFallback = () => {
    emailFallback.hidden = false;
    fallbackToggle.hidden = true;
  };

  emailForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!emailForm.reportValidity()) {
      return;
    }

    const formData = new FormData(emailForm);
    const field = (name) => (formData.get(name) || "").trim();
    const message = field("message");
    const lines = [
      `Name: ${field("parent-name")}`,
      `Email: ${field("parent-email")}`,
      `Child's age: ${field("child-age")}`,
      `Preferred days: ${field("preferred-days") || "Not specified"}`,
      `Desired start date: ${field("start-date") || "Not specified"}`,
    ];

    if (message) {
      lines.push("", "Message:", message);
    }

    const body = lines.join("\n");

    fallbackText.value = body;
    emailFallback.hidden = true;
    fallbackToggle.hidden = true;
    copyButton.textContent = "Copy this note";
    emailStatus.textContent = "Opening your email…";

    // Nothing reports back whether a mailto: handler actually opened. But when one does
    // -- a desktop mail app, or a new tab for a web handler like Gmail -- the page loses
    // focus, so treat that as the signal it worked. No focus change after a beat means
    // nothing is registered here, and this visitor needs the copy-and-paste path.
    let handedOff = false;
    const noteBlur = () => {
      handedOff = true;
    };
    const noteVisibility = () => {
      if (document.hidden) {
        handedOff = true;
      }
    };

    window.addEventListener("blur", noteBlur);
    document.addEventListener("visibilitychange", noteVisibility);

    window.location.href = `mailto:${mayzaEmail}?subject=${encodeURIComponent("Sunflower Garden inquiry")}&body=${encodeURIComponent(body)}`;

    window.setTimeout(() => {
      window.removeEventListener("blur", noteBlur);
      document.removeEventListener("visibilitychange", noteVisibility);

      if (handedOff) {
        emailStatus.textContent = "Your email is open with this note ready to send.";
        fallbackToggle.hidden = false;
        return;
      }

      emailStatus.textContent = `This device doesn't have an email app set up. Copy the note below and send it to ${mayzaEmail}.`;
      revealFallback();
    }, 1200);
  });

  fallbackToggle.addEventListener("click", revealFallback);

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(fallbackText.value);
      copyButton.textContent = "Copied";
      window.setTimeout(() => {
        copyButton.textContent = "Copy this note";
      }, 2400);
    } catch (error) {
      fallbackText.focus();
      fallbackText.select();
      copyButton.textContent = "Press Ctrl+C to copy";
    }
  });
}

const reviewCarousel = document.querySelector("[data-review-carousel]");

if (reviewCarousel) {
  const reviewTrack = reviewCarousel.querySelector("[data-review-track]");
  const reviewCards = Array.from(reviewTrack.querySelectorAll(".review-card"));
  const prevButton = reviewCarousel.querySelector("[data-review-prev]");
  const nextButton = reviewCarousel.querySelector("[data-review-next]");
  const reviewStatus = reviewCarousel.querySelector("[data-review-status]");
  let updateFrame;

  const getMetrics = () => {
    const gap = Number.parseFloat(getComputedStyle(reviewTrack).gap) || 0;
    const cardWidth = reviewCards[0]?.getBoundingClientRect().width || reviewTrack.clientWidth;
    const step = cardWidth + gap;
    const visibleCount = Math.max(1, Math.round((reviewTrack.clientWidth + gap) / step));
    const maxStart = Math.max(0, reviewCards.length - visibleCount);
    const currentIndex = Math.min(maxStart, Math.max(0, Math.round(reviewTrack.scrollLeft / step)));

    return { step, visibleCount, maxStart, currentIndex };
  };

  const updateReviewControls = () => {
    const { visibleCount, maxStart, currentIndex } = getMetrics();
    const firstVisible = currentIndex + 1;
    const lastVisible = Math.min(reviewCards.length, currentIndex + visibleCount);

    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === maxStart;
    reviewStatus.textContent = `Reviews ${firstVisible}–${lastVisible} of ${reviewCards.length}`;
  };

  const moveReviews = (direction) => {
    // Steps one card at a time (rather than a full page of visibleCount cards) so the
    // card just scrolled past stays peeking at the edge -- see the scroll-padding-inline
    // on .review-track that reserves the room for it.
    const { step, maxStart, currentIndex } = getMetrics();
    const targetIndex = Math.min(maxStart, Math.max(0, currentIndex + direction));
    reviewTrack.scrollTo({ left: targetIndex * step, behavior: "smooth" });
  };

  prevButton.addEventListener("click", () => moveReviews(-1));
  nextButton.addEventListener("click", () => moveReviews(1));
  reviewTrack.addEventListener("scroll", () => {
    window.cancelAnimationFrame(updateFrame);
    updateFrame = window.requestAnimationFrame(updateReviewControls);
  }, { passive: true });
  window.addEventListener("resize", updateReviewControls);
  updateReviewControls();
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
