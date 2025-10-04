// my-profile.js
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedInUser");
      console.log("User logged out 🚪");
      window.location.href = "landing-page.html";
    });
  }
});