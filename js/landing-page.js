// landing-page.js

// --- Listener 1: run header update
document.addEventListener("DOMContentLoaded", () => {
  updateLandingPageUI();
});

// --- Listener 2: inject cards
document.addEventListener("DOMContentLoaded", () => {
  console.log("Landing page JS loaded ✅");

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const recipeCardsContainer = document.getElementById("recipeCards");

  const recipes = [
    {
      title: "Creamy Carbonara",
      author: "Maria Romano",
      color: "var(--primary)",
      rating: "4.9",
      comments: "234",
      time: "25 min",
    },
    {
      title: "Rainbow Cupcakes",
      author: "Emma Baker",
      color: "var(--accent)",
      rating: "4.8",
      comments: "189",
      time: "40 min",
    },
    {
      title: "Thai Green Curry",
      author: "Alex Chen",
      color: "#10B981",
      rating: "4.7",
      comments: "310",
      time: "35 min",
    },
  ];

  function createCard(recipe, index) {
    return `
      <article class="card rounded-xl-soft shadow-soft hover:shadow-lg fadeInUp" data-index="${index}">
        <div class="card-top" style="background-color: ${recipe.color}"></div>
        <div class="card-body">
          <div>
            <h4 class="font-bold text-gray-900">${recipe.title}</h4>
            <p class="text-muted text-sm mt-1">${recipe.author}</p>
          </div>
          <div class="card-meta">
            <span class="flex items-center gap-2"><i class="fa-solid fa-star star"></i>${recipe.rating}</span>
            <span class="flex items-center gap-2"><i class="fa-solid fa-comment"></i>${recipe.comments}</span>
            <span class="flex items-center gap-2"><i class="fa-solid fa-clock"></i>${recipe.time}</span>
          </div>
        </div>
      </article>
    `;
  }

  if (recipeCardsContainer) {
    recipeCardsContainer.innerHTML = recipes.map(createCard).join("");
    console.log("Recipe cards injected ✅");

    // Attach click listeners for modal
    const cards = recipeCardsContainer.querySelectorAll(".card");
    cards.forEach((card, index) => {
      card.addEventListener("click", () => {
        console.log("Card clicked:", recipes[index]);
        openRecipeModal(recipes[index]); // call modal logic
      });
    });
  }

  // (Kept your existing login logic here too if needed)
});

// --- Listener 3: wire up modal after cards exist
document.addEventListener("DOMContentLoaded", () => {
  const recipeCardsContainer = document.getElementById("recipeCards");
  if (!recipeCardsContainer) return;

  recipeCardsContainer.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;

    const idx = card.dataset.index;
    console.log("Card clicked:", idx);

    // Call modal function from recipe-modal.js
    if (typeof openRecipeModal === "function") {
      // later we’ll pass actual recipe details here
      openRecipeModal({ title: card.querySelector("h4").innerText });
    }
  });
});
