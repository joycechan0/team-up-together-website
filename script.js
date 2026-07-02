/* ===========================================================
   Team Up Together — Interactions
   =========================================================== */
(function () {
  "use strict";

  /* ---------- Current year in footer ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");

  function closeMenu() {
    if (!navMenu) return;
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var open = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });

    // Close the menu after clicking a link (mobile)
    navMenu.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Header shadow + back-to-top on scroll ---------- */
  var header = document.querySelector(".site-header");
  var backToTop = document.getElementById("backToTop");

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("scrolled", y > 8);
    if (backToTop) backToTop.classList.toggle("show", y > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("revealed"); });
  }

  /* ---------- Animated impact counters ---------- */
  var counters = document.querySelectorAll(".stat-number");

  function formatNumber(n) {
    return n.toLocaleString("en-US");
  }

  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1600;
    var start = null;

    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      // easeOutCubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(eased * target);
      el.textContent = formatNumber(value) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window && counters.length) {
    var countObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) { countObserver.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent =
        formatNumber(parseInt(el.getAttribute("data-count"), 10) || 0) +
        (el.getAttribute("data-suffix") || "");
    });
  }

  /* ---------- Project detail modal ---------- */
  var modal = document.getElementById("projectModal");
  var projectCards = document.querySelectorAll(".project-card");
  var lastFocused = null;

  function openProject(card) {
    if (!modal) return;
    var photoClass = card.getAttribute("data-photo") || "";
    var story = card.querySelector(".project-story");

    var modalPhoto = document.getElementById("modalPhoto");
    modalPhoto.className = "modal-photo " + photoClass;
    modalPhoto.textContent = card.getAttribute("data-emoji") || "";
    document.getElementById("modalCause").innerHTML = card.getAttribute("data-cause") || "";
    document.getElementById("modalTitle").innerHTML = card.getAttribute("data-title") || "";
    document.getElementById("modalMeta").textContent = card.getAttribute("data-meta") || "";
    document.getElementById("modalStory").innerHTML = story ? story.innerHTML : "";

    // Hide "Start a project like this" for projects that are already running
    var startBtn = document.getElementById("modalStartBtn");
    if (startBtn) startBtn.style.display = card.hasAttribute("data-started") ? "none" : "";

    lastFocused = card;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var closeBtn = document.getElementById("modalClose");
    if (closeBtn) closeBtn.focus();
  }

  function closeProject() {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  projectCards.forEach(function (card) {
    card.addEventListener("click", function () { openProject(card); });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openProject(card);
      }
    });
  });

  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target.hasAttribute("data-close") || e.target.closest("[data-close]")) {
        closeProject();
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("open")) closeProject();
    });
  }

  /* ---------- Form validation + feedback ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setStatus(el, message, type) {
    if (!el) return;
    el.textContent = message;
    el.className = "form-status " + (type || "");
  }

  function validateField(field) {
    var value = (field.value || "").trim();
    var ok = true;
    if (field.hasAttribute("required") && !value) ok = false;
    if (ok && field.type === "email" && value) ok = EMAIL_RE.test(value);
    field.classList.toggle("invalid", !ok);
    return ok;
  }

  function handleForm(formId, statusId, successMsg) {
    var form = document.getElementById(formId);
    var status = document.getElementById(statusId);
    if (!form) return;

    // Clear invalid state as the user types
    form.addEventListener("input", function (e) {
      if (e.target.classList.contains("invalid")) validateField(e.target);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fields = form.querySelectorAll("input, select, textarea");
      var allValid = true;
      var firstInvalid = null;

      fields.forEach(function (field) {
        var valid = validateField(field);
        if (!valid && !firstInvalid) firstInvalid = field;
        if (!valid) allValid = false;
      });

      if (!allValid) {
        setStatus(status, "Please fill in the highlighted fields correctly.", "error");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Simulated submission (no backend in this static demo)
      setStatus(status, successMsg, "success");
      form.reset();
    });
  }

  handleForm(
    "startForm",
    "startStatus",
    "Love it! A coordinator will reach out within 3 days to help bring your idea to life. 💡"
  );
  handleForm(
    "volunteerForm",
    "volunteerStatus",
    "Thank you for signing up! We'll match you with a project and team soon. 🎉"
  );
  handleForm(
    "contactForm",
    "contactStatus",
    "Message sent! A real human will reply within two business days. ✉️"
  );
  handleForm(
    "newsletterForm",
    "newsletterStatus",
    "You're subscribed — welcome to the community! 💌"
  );
})();
