// sign-in-up.js
document.addEventListener("DOMContentLoaded", () => {
  // --- SIGN IN FORM HANDLER ---
  const signInForm = document.getElementById("sign-in-form");
  if (signInForm) {
    signInForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("signin-email").value.trim();
      const password = document.getElementById("signin-password").value.trim();

      if (!email || !password) {
        alert("Please fill in all fields.");
        return;
      }

      const user = { email, username: email.split("@")[0] };
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Redirect to landing page (header will update automatically)
      window.location.href = "home.html";
    });
  }

  // --- SIGN UP FORM HANDLER ---
  const signUpForm = document.getElementById("sign-up-form");
  if (signUpForm) {
    signUpForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const firstName = document.getElementById("signup-first").value.trim();
      const lastName = document.getElementById("signup-last").value.trim();
      const email = document.getElementById("signup-email").value.trim();
      const password = document.getElementById("signup-password").value.trim();

      if (!firstName || !lastName || !email || !password) {
        alert("Please fill in all fields.");
        return;
      }

      const username = `${firstName} ${lastName}`;
      const user = { email, username };

      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "home.html";
    });
  }

  // // --- LOG OUT HANDLER ---
  // const logoutBtn = document.getElementById("logoutBtn");
  // if (logoutBtn) {
  //   logoutBtn.addEventListener("click", () => {
  //     localStorage.removeItem("loggedInUser");
  //     window.location.href = "landing-page.html";
  //   });
  // }
});
