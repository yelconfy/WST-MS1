// js/modal.js
document.addEventListener("DOMContentLoaded", () => {
  // fetch and inject modal HTML
  fetch("modal.html")
    .then(res => res.text())
    .then(html => {
      const container = document.getElementById("modalContainer");
      container.innerHTML = html;

      const openBtn = document.getElementById("openModalBtn");
      const modal = document.getElementById("featureModal");
      const closeBtn = modal ? modal.querySelector(".modal-close") : null;
      const ctaBtn = modal ? modal.querySelector(".modal-cta") : null;

      if (!openBtn) {
        console.warn("openModalBtn not found");
        return;
      }
      if (!modal) {
        console.error("featureModal not found in modal.html");
        return;
      }

      // open
      openBtn.addEventListener("click", (e) => {
        e.preventDefault();
        modal.classList.add("active");
        // ensure focus for accessibility
        setTimeout(() => {
          const firstFocusable = modal.querySelector(".modal-cta, button, a, input, textarea");
          if (firstFocusable) firstFocusable.focus();
        }, 50);
      });

      // close handlers (close icon and CTA can close / CTA can redirect if needed)
      [closeBtn, ctaBtn].forEach(btn => {
        if (!btn) return;
        btn.addEventListener("click", (ev) => {
          // if CTA should redirect to sign-up page instead of close, replace below:
          // window.location.href = 'sign-up.html';
          modal.classList.remove("active");
        });
      });

      // click outside to close
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("active");
        }
      });

      // esc to close
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) {
          modal.classList.remove("active");
        }
      });
    })
    .catch(err => {
      console.error("Error loading modal.html:", err);
    });
});
