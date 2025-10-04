// header.js
function updateLandingPageUI() {
  console.log("Landing page UI update triggered ✅");

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  console.log("Logged in user from storage:", loggedInUser);

  const signInLink = document.querySelector('nav a[href="sign-in.html"]');
  const uploadBtn = document.getElementById("openModalBtn");

  if (loggedInUser) {
    if (signInLink) {
      signInLink.textContent = "My Profile";
      signInLink.setAttribute("href", "my-profile.html");
      console.log("Updated Sign In → My Profile");
    }

    if (uploadBtn) {
      uploadBtn.setAttribute("href", "upload-recipe.html");
      uploadBtn.removeAttribute("id"); // prevent modal logic
      console.log("Updated Upload button → upload-recipe.html");
    }
  }
}

fetch("header.html")
  .then((res) => res.text())
  .then((data) => {
    const headerEl = document.getElementById("header");
    if (headerEl) {
      headerEl.innerHTML = data;

      // Check login state from localStorage
      const user = localStorage.getItem("user"); // e.g. set in sign-in-up.js
      const profileLink = document.getElementById("profileLink");

      if (profileLink) {
        if (user) {
          profileLink.textContent = "My Profile";
          profileLink.setAttribute("href", "my-profile.html");
        } else {
          profileLink.textContent = "Sign In";
          profileLink.setAttribute("href", "sign-in.html");
        }
      }

      // Run page-specific UI updates if available
      if (typeof updateLandingPageUI === "function") {
        updateLandingPageUI();
      }
    } else {
      console.warn("No #header element found on this page.");
    }
  })
  .catch((err) => console.error("Failed to load header:", err));
