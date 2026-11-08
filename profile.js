async function showProfile() {
  const user = await requireAuth();
  if (!user) {
    return;
  }

  document.getElementById("profile-username").textContent = user.username;
  document.getElementById("profile-first-name").textContent =
    user.first_name || "—";
  document.getElementById("profile-last-name").textContent =
    user.last_name || "—";
  document.getElementById("profile-email").textContent = user.email;
  document.getElementById("profile-role").textContent = user.is_staff
    ? "Адміністратор"
    : "Користувач";
  document.getElementById("profile").hidden = false;
}

showProfile();