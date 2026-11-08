redirectIfLoggedIn();

const form = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const message = document.getElementById("message");

function getNextPage() {
  const next = new URLSearchParams(window.location.search).get("next");
  if (next && /^[\w-]+\.html(\?[\w=&%-]*)?$/.test(next)) {
    return next;
  }
  return "index.html";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";

  try {
    const response = await apiFetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: usernameInput.value.trim(),
        password: passwordInput.value,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      message.textContent = data.detail;
      return;
    }
    saveTokens(data.access, data.refresh);
    window.location.href = getNextPage();
  } catch (error) {
    message.textContent = "Не вдалося звʼязатися із сервером.";
  }
});