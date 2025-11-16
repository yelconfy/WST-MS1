// header.js — robust version
fetch("header.html")
  .then((res) => {
    if (!res.ok) throw new Error("Failed to fetch header.html: " + res.status);
    return res.text();
  })
  .then((html) => {
    const headerEl = document.getElementById("header");
    if (!headerEl) {
      console.error("No #header placeholder found.");
      return;
    }
    headerEl.innerHTML = html;
    // Small timeout ensures DOM parsed (usually not needed but safe)
    requestAnimationFrame(setupHeaderUI);
  })
  .catch((err) => console.error("Header load failed:", err));

function setupHeaderUI() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const userPill = document.getElementById("userPillContainer");

    if (!userPill) {
      console.error("userPillContainer missing from header.html");
      return;
    }

    if (!user) {
      userPill.innerHTML = `
    <button id="openModalBtn"
      class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFEFE8] border border-[#E4572E]/40 hover:bg-[#FFDCD0] transition-all duration-200 shadow-sm">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-[#E4572E]" fill="none"
        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      <span class="text-sm font-medium text-gray-700">Upload a Recipe</span>
    </button>
  `;
      return;
    }

    // LOGGED IN — use username safely (fallback to email)
    const displayName =
      user.username ||
      user.name ||
      (user.email ? user.email.split("@")[0] : "User");

    userPill.innerHTML = `
      <div class="group relative inline-block">
        <button id="userPillBtn" class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFEFE8] border border-[#E4572E]/40 hover:bg-[#FFDCD0] transition-all duration-200 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-[#E4572E]" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M5.121 17.804A8 8 0 1118.879 17.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span id="userName" class="text-sm font-medium text-gray-700">${escapeHtml(
            displayName
          )}</span>
          <svg xmlns="http://www.w3.org/2000/svg"
            class="w-3.5 h-3.5 text-gray-500" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div class="dropdown-menu absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg" style="display:none;">
          <a href="my-profile.html" class="block px-4 py-2 hover:bg-gray-100">Profile</a>
          <a href="#" id="logoutBtn" class="block px-4 py-2 hover:bg-gray-100">Log Out</a>
        </div>
      </div>
    `;

    // mobile/touch: toggle
    const group = userPill.querySelector(".group");
    const btn = document.getElementById("userPillBtn");
    const dropdown = group ? group.querySelector(".dropdown-menu") : null;

    if (btn && dropdown) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = dropdown.style.display === "block";
        dropdown.style.display = isOpen ? "none" : "block";
      });
      document.addEventListener("click", () => {
        dropdown.style.display = "none";
      });
    }

    const logout = document.getElementById("logoutBtn");
    if (logout) {
      logout.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("user");
        // cleanup and reload
        window.location.href = "landing-page.html";
      });
    }

    // HOME TAB DYNAMIC ROUTING
    const homeLink = document.querySelector("#homeLink");
    if (homeLink) {
      homeLink.addEventListener("click", (e) => {
        e.preventDefault();

        const user = JSON.parse(localStorage.getItem("user"));

        if (user) {
          window.location.href = "home.html"; // logged in
        } else {
          window.location.href = "landing-page.html"; // logged out
        }
      });
    }
  } catch (err) {
    console.error("setupHeaderUI error:", err);
  }
}

// tiny escape helper for safety (no external libs)
function escapeHtml(str) {
  return String(str).replace(
    /[&<>"']/g,
    (s) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        s
      ])
  );
}
