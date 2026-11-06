(() => {
  const headerNav = document.querySelector(".nav");
  const menuToggle = document.querySelector(".menu-toggle");
  const form = document.getElementById("register-form");
  const status = document.getElementById("form-status");

  if (menuToggle && headerNav) {
    menuToggle.addEventListener("click", () => {
      const open = headerNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });

    headerNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        headerNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const revealItems = document.querySelectorAll(
    ".about, .award-layout > *, .pillars article, .program-list li, .speaker-list li, .register-layout > *"
  );

  revealItems.forEach((el) => el.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );

    revealItems.forEach((el) => observer.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  }

  if (form && status) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();

      if (!name || !email) {
        status.textContent = "Заполните имя и email.";
        return;
      }

      const payload = {
        name,
        email,
        org: String(data.get("org") || "").trim(),
        createdAt: new Date().toISOString(),
      };

      try {
        const key = "esg-forum-demo-registrations";
        const existing = JSON.parse(localStorage.getItem(key) || "[]");
        existing.push(payload);
        localStorage.setItem(key, JSON.stringify(existing));
      } catch {
        // Demo fallback: ignore storage errors.
      }

      form.reset();
      status.textContent = "Заявка принята. Спасибо — это демо-подтверждение.";
    });
  }
})();
