// ----------------------------------------------------------
// FIX: Load updated recipes (from localStorage)
// ----------------------------------------------------------
if (localStorage.getItem("RECIPES")) {
  try {
    window.RECIPES = JSON.parse(localStorage.getItem("RECIPES"));
  } catch (e) {
    console.error("Failed to load saved recipes:", e);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // User welcome title
  const user = JSON.parse(localStorage.getItem("user"));
  const welcomeTitle = document.getElementById("welcomeTitle");
  if (user && welcomeTitle) {
    const name = user.username || user.email.split("@")[0];
    welcomeTitle.textContent = `Welcome back, ${name}!`;
  }

  // Tabs and content container
  const tabs = document.querySelectorAll(".tab-btn");
  const tabContent = document.getElementById("tabContent");

  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      setActiveTab(btn.dataset.tab);
    });
  });

  function setActiveTab(tabName) {
    tabs.forEach((t) => t.classList.remove("active-tab"));
    const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeBtn) activeBtn.classList.add("active-tab");
    renderTab(tabName);
  }

  function renderTab(tab) {
    tabContent.innerHTML = "";

    if (tab === "continue") {
      renderCardList(RECIPES.filter((r) => r.inProgress));
      return;
    }

    if (tab === "recommended") {
      renderCardList(RECIPES.filter((r) => !r.inProgress));
      return;
    }

    if (tab === "feed") {
      FEED_SOURCE = [...RECIPES];
      feedIndex = 0;
      loadFeedBatch();
      return;
    }
  }

  function renderCardList(list) {
    if (list.length === 0) {
      tabContent.innerHTML = `<p class="text-gray-500">No recipes to show yet.</p>`;
      return;
    }

    tabContent.innerHTML = "";
    list.forEach((r) => tabContent.appendChild(renderCard(r)));
  }

  // function renderCard(r) {
  //   const card = document.createElement("article");
  //   card.className = "card shadow-soft fadeInUp cursor-pointer";

  //   card.innerHTML = `
  //     <img src="${r.img}" class="w-full h-40 object-cover" />
  //     <div class="card-body">
  //       <h3 class="font-bold text-gray-900">${r.title}</h3>
  //       <p class="text-sm text-gray-600">${r.author}</p>
  //       <div class="card-meta mt-2">
  //         <span><i class="fa-solid fa-star star"></i> ${r.rating}</span>
  //         <span><i class="fa-solid fa-clock"></i> ${r.time}</span>
  //       </div>
  //     </div>
  //   `;

  //   card.addEventListener("click", () => {
  //     window.location.href = `recipe.html?id=${r.id}`;
  //   });

  //   return card;
  // }

  function renderCard(r) {
    const card = document.createElement("article");
    card.className = "card shadow-soft fadeInUp cursor-pointer";

    card.innerHTML = `
    <img src="${r.img}" class="w-full h-40 object-cover recipe-img" />
    <div class="card-body">
      <h3 class="font-bold text-gray-900">${r.title}</h3>
      <p class="text-sm text-gray-600">${r.author}</p>
      <div class="card-meta mt-2">
        <span><i class="fa-solid fa-star star"></i> ${r.rating}</span>
        <span><i class="fa-solid fa-clock"></i> ${r.time}</span>
      </div>
    </div>
  `;

    // ⭐ FIX: Add fallback image if original fails
    const img = card.querySelector("img");
    img.onerror = () => {
      img.src = "https://picsum.photos/600/400?random=" + r.id;
    };

    // click
    card.addEventListener("click", () => {
      window.location.href = `recipe.html?id=${r.id}`;
    });

    return card;
  }

  let feedIndex = 0;
  const FEED_BATCH = 12;
  let FEED_SOURCE = [];

  function loadFeedBatch() {
    const next = FEED_SOURCE.slice(feedIndex, feedIndex + FEED_BATCH);
    feedIndex += FEED_BATCH;
    next.forEach((r) => tabContent.appendChild(renderCard(r)));
  }

  window.addEventListener("scroll", () => {
    const nearBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;

    const feedIsActive = document.querySelector('[data-tab="feed"].active-tab');
    if (feedIsActive && nearBottom) loadFeedBatch();
  });

  // Initial default tab
  setActiveTab("continue");
});
