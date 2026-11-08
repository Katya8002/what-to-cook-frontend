const form = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const message = document.getElementById("message");
const recipesList = document.getElementById("recipes");

function renderRecipes(recipes) {
  recipesList.innerHTML = "";

  if (recipes.length === 0) {
    message.textContent = "Рецептів не знайдено.";
    return;
  }

  message.textContent = "";
  recipes.forEach((recipe) => {
    const item = document.createElement("li");
    item.className = "recipe";

    const name = document.createElement("h2");
    name.className = "recipe__name";
    name.textContent = recipe.name;

    const meta = document.createElement("div");
    meta.className = "recipe__meta";

    const category = document.createElement("span");
    category.className = "magnet";
    category.textContent = recipe.category.name;

    const time = document.createElement("span");
    time.className = "recipe__time";
    time.textContent = recipe.cooking_time_min + " хв";

    meta.append(category, time);
    item.append(name, meta);
    recipesList.appendChild(item);
  });
}

async function loadRecipes(search) {
  let url = "/recipes";
  if (search) {
    url += "?search=" + encodeURIComponent(search);
  }

  try {
    const response = await apiFetch(url);
    const data = await response.json();

    if (!response.ok) {
      recipesList.innerHTML = "";
      message.textContent = data.detail;
      return;
    }
    renderRecipes(data);
  } catch (error) {
    recipesList.innerHTML = "";
    message.textContent = "Не вдалося звʼязатися із сервером.";
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  loadRecipes(searchInput.value.trim());
});

loadRecipes("");