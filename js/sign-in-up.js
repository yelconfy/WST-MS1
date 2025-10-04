// // sign-in-up.js
// document.addEventListener("DOMContentLoaded", () => {
//   // --- SIGN IN FORM HANDLER ---
//   const signInForm = document.getElementById("sign-in-form");
//   if (signInForm) {
//     signInForm.addEventListener("submit", (e) => {
//       e.preventDefault();

//       // Get values
//       const email = document.getElementById("signin-email").value.trim();
//       const password = document.getElementById("signin-password").value.trim();

//       if (!email || !password) {
//         alert("Please fill in all fields.");
//         return;
//       }

//       // Fake login (replace with real backend later)
//       const user = { email, username: email.split("@")[0] };

//       // Save user to localStorage
//       localStorage.setItem("loggedInUser", JSON.stringify(user));

//       // Redirect to profile
//       window.location.href = "my-profile.html";
//     });
//   }

//   // --- SIGN UP FORM HANDLER ---
//   const signUpForm = document.getElementById("sign-up-form");
//   if (signUpForm) {
//     signUpForm.addEventListener("submit", (e) => {
//       e.preventDefault();

//       const username = document.getElementById("signup-username").value.trim();
//       const email = document.getElementById("signup-email").value.trim();
//       const password = document.getElementById("signup-password").value.trim();

//       if (!username || !email || !password) {
//         alert("Please fill in all fields.");
//         return;
//       }

//       // Fake signup -> log user in immediately
//       const user = { email, username };

//       localStorage.setItem("loggedInUser", JSON.stringify(user));

//       window.location.href = "my-profile.html";
//     });
//   }

//   // --- LOG OUT HANDLER ---
//   const logoutBtn = document.getElementById("logoutBtn");
//   if (logoutBtn) {
//     logoutBtn.addEventListener("click", () => {
//       localStorage.removeItem("loggedInUser");
//       window.location.href = "landing-page.html";
//     });
//   }
// });

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
      localStorage.setItem("loggedInUser", JSON.stringify(user));

      // ✅ Redirect to landing page (header will update automatically)
      window.location.href = "landing-page.html";
    });
  }

  // --- SIGN UP FORM HANDLER ---
  const signUpForm = document.getElementById("sign-up-form");
  if (signUpForm) {
    signUpForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("signup-username").value.trim();
      const email = document.getElementById("signup-email").value.trim();
      const password = document.getElementById("signup-password").value.trim();

      if (!username || !email || !password) {
        alert("Please fill in all fields.");
        return;
      }

      const user = { email, username };
      localStorage.setItem("loggedInUser", JSON.stringify(user));

      // ✅ Redirect to landing page
      window.location.href = "landing-page.html";
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
