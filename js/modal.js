// modal.js — supports dynamic elements
document.addEventListener("DOMContentLoaded", () => {
  fetch("modal.html")
    .then((res) => res.text())
    .then((html) => {
      const container = document.getElementById("modalContainer");
      container.innerHTML = html;

      const modal = document.getElementById("featureModal");
      const closeBtn = modal.querySelector(".modal-close");
      const ctaBtn = modal.querySelector(".modal-cta");

      // EVENT DELEGATION — works even if #openModalBtn is added later
      document.body.addEventListener("click", (e) => {
        const btn = e.target.closest("#openModalBtn");
        if (!btn) return;

        e.preventDefault();
        modal.classList.add("active");

        // auto-focus first element
        setTimeout(() => {
          const firstFocusable = modal.querySelector(
            ".modal-cta, button, a, input, textarea"
          );
          if (firstFocusable) firstFocusable.focus();
        }, 50);
      });

      // ---- CLOSE HANDLERS ----
      [closeBtn, ctaBtn].forEach((b) => {
        if (!b) return;
        b.addEventListener("click", () => modal.classList.remove("active"));
      });

      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("active");
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") modal.classList.remove("active");
      });
    })
    .catch((err) => console.error("Error loading modal.html:", err));
});
