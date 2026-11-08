redirectIfLoggedIn();

const form = document.getElementById("register-form");
const message = document.getElementById("message");
const fields = [
  "username",
  "first_name",
  "last_name",
  "email",
  "password",
  "password_confirm",
];

function clearErrors() {
  message.textContent = "";
  document.querySelectorAll(".field__error").forEach((element) => {
    element.textContent = "";
  });
}

function showErrors(errors) {
  Object.keys(errors).forEach((name) => {
    const text = [].concat(errors[name]).join(" ");
    const element = document.querySelector('[data-error="' + name + '"]');
    if (element) {
      element.textContent = text;
    } else {
      message.textContent = text;
    }
  });
}

async function loginAfterRegister(username, password) {
  const response = await apiFetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: username, password: password }),
  });
  if (!response.ok) {
    window.location.href = "login.html";
    return;
  }
  const tokens = await response.json();
  saveTokens(tokens.access, tokens.refresh);
  window.location.href = "index.html";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearErrors();

  const body = {};
  fields.forEach((name) => {
    const value = document.getElementById(name).value;
    body[name] = name.startsWith("password") ? value : value.trim();
  });

  try {
    const response = await apiFetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      await loginAfterRegister(body.username, body.password);
      return;
    }

    const data = await response.json();
    if (data.errors || !data.detail) {
      showErrors(data.errors || data);
    } else {
      message.textContent = data.detail;
    }
  } catch (error) {
    message.textContent = "Не вдалося звʼязатися із сервером.";
  }
});