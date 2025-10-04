// recipe-modal.js
function openRecipeModal(recipe) {
  const modalContainer = document.getElementById("modalContainer");
  if (!modalContainer) return;

  modalContainer.innerHTML = `
    <div id="recipeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <button id="closeRecipeModal" class="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <i class="fa-solid fa-xmark text-xl"></i>
        </button>
        <h2 class="text-2xl font-bold mb-4">${recipe.title}</h2>
        <p class="text-gray-600 mb-2">By ${recipe.author}</p>
        <p class="text-gray-700">Cooking time: ${recipe.time}</p>
        <p class="text-gray-700">⭐ ${recipe.rating} · 💬 ${recipe.comments}</p>
      </div>
    </div>
  `;

  document.getElementById("closeRecipeModal").addEventListener("click", () => {
    modalContainer.innerHTML = "";
  });

  // Close on background click
  document.getElementById("recipeModal").addEventListener("click", (e) => {
    if (e.target.id === "recipeModal") {
      modalContainer.innerHTML = "";
    }
  });
}

// expose globally so landing-page.js can call it
window.openRecipeModal = openRecipeModal;