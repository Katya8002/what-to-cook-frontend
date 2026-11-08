const API_URL = "http://127.0.0.1:8000/api/v1";

function getAccess() {
  return localStorage.getItem("access");
}

function getRefresh() {
  return localStorage.getItem("refresh");
}

function saveTokens(access, refresh) {
  localStorage.setItem("access", access);
  if (refresh) {
    localStorage.setItem("refresh", refresh);
  }
}

function clearTokens() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}

async function refreshAccess() {
  const refresh = getRefresh();
  if (!refresh) {
    return false;
  }
  try {
    const response = await fetch(API_URL + "/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refresh }),
    });
    if (!response.ok) {
      clearTokens();
      return false;
    }
    const data = await response.json();
    saveTokens(data.access);
    return true;
  } catch (error) {
    return false;
  }
}

function send(path, options) {
  const headers = { ...options.headers };
  const access = getAccess();
  if (access) {
    headers.Authorization = "Bearer " + access;
  }
  return fetch(API_URL + path, { ...options, headers: headers });
}

async function apiFetch(path, options = {}) {
  let response = await send(path, options);
  if (response.status === 401 && getRefresh()) {
    await refreshAccess();
    response = await send(path, options);
  }
  return response;
}

async function getCurrentUser() {
  if (!getRefresh()) {
    return null;
  }
  try {
    const response = await apiFetch("/users/me");
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    return null;
  }
}

function logout() {
  clearTokens();
  window.location.href = "index.html";
}

async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    const page =
      window.location.pathname.split("/").pop() + window.location.search;
    window.location.href = "login.html?next=" + encodeURIComponent(page);
    return null;
  }
  return user;
}

async function redirectIfLoggedIn() {
  const user = await getCurrentUser();
  if (user) {
    window.location.href = "index.html";
  }
}

async function renderNav() {
  const nav = document.getElementById("nav");
  const user = await getCurrentUser();
  nav.innerHTML = "";

  if (user) {
    const profile = document.createElement("a");
    profile.href = "profile.html";
    profile.className = "header__user";
    profile.textContent = user.username;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "button button--ghost";
    button.textContent = "Вийти";
    button.addEventListener("click", logout);

    nav.append(profile, button);
    return;
  }

  const login = document.createElement("a");
  login.href = "login.html";
  login.className = "button button--ghost";
  login.textContent = "Увійти";

  const register = document.createElement("a");
  register.href = "register.html";
  register.className = "button";
  register.textContent = "Реєстрація";

  nav.append(login, register);
}

renderNav();