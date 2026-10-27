const API_URL = "http://127.0.0.1:8000/api/v1";

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

    const info = document.createElement("p");
    info.className = "recipe__info";
    info.textContent =
      recipe.category.name + " · " + recipe.cooking_time_min + " хв";

    item.append(name, info);
    recipesList.appendChild(item);
  });
}

async function loadRecipes(search) {
  let url = API_URL + "/recipes";
  if (search) {
    url += "?search=" + encodeURIComponent(search);
  }

  try {
    const response = await fetch(url);
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