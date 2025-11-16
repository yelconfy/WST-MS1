document.addEventListener("DOMContentLoaded", () => {
  // prefer persisted recipes if present
  if (localStorage.getItem("RECIPES"))
    window.RECIPES = JSON.parse(localStorage.getItem("RECIPES"));

  const params = new URLSearchParams(window.location.search);
  const recipeId = parseInt(params.get("id"));

  const recipe = RECIPES.find((r) => r.id === recipeId);
  const container = document.getElementById("recipeContainer");

  if (!recipe) {
    container.innerHTML = `<p class="text-gray-600">Recipe not found.</p>`;
    return;
  }

  // FIX: normalize ingredients
  const renderIngredient = (ing) => {
    if (typeof ing === "string") return ing; // built-in recipe
    if (ing && typeof ing === "object")
      return `${ing.amount || ""} ${ing.name || ""}`.trim(); // uploaded recipe
    return "";
  };

  // FIX: normalize steps
  const renderStep = (step) => {
    if (typeof step === "string") return step;
    if (step && typeof step === "object") return step.text || "";
    return "";
  };

  container.innerHTML = `
    <section class="recipe-hero">
      <img src="${recipe.img}" class="recipe-img" />

      <h1 class="recipe-title">${recipe.title}</h1>
      <p class="recipe-author">By ${recipe.author}</p>

      <div class="recipe-stats">
        <span><i class="fa-solid fa-star"></i> ${recipe.rating}</span>
        <span><i class="fa-solid fa-clock"></i> ${recipe.time}</span>
        <span><i class="fa-solid fa-fire"></i> ${recipe.calories || ""} kcal</span>
        <span><i class="fa-solid fa-users"></i> ${recipe.servings} servings</span>
      </div>
    </section>

    <section class="recipe-section">
      <h2>Description</h2>
      <p>${recipe.description}</p>
    </section>

    <!-- TWO COLUMN LAYOUT -->
    <section class="recipe-section">
      <div style="
        display: grid;
        grid-template-columns: 1fr;
        gap: 40px;
      " class="two-col-wrapper">

        <!-- LEFT: INGREDIENTS -->
        <div>
          <h2>Ingredients</h2>
          <ul class="ingredient-list">
            ${recipe.ingredients
              .map(i => `<li><i class="fa-solid fa-check"></i> ${renderIngredient(i)}</li>`)
              .join("")}
          </ul>
        </div>

        <!-- RIGHT: STEPS -->
        <div>
          <h2>Steps</h2>
          <ol class="step-list">
            ${recipe.steps.map(s => `<li>${renderStep(s)}</li>`).join("")}
          </ol>
        </div>

      </div>
    </section>
  `;

  // RESPONSIVE GRID
  const wrapper = container.querySelector(".two-col-wrapper");
  const mq = window.matchMedia("(min-width: 900px)");
  const applyLayout = () => {
    wrapper.style.gridTemplateColumns = mq.matches ? "1fr 1fr" : "1fr";
  };
  mq.addEventListener("change", applyLayout);
  applyLayout();
});
