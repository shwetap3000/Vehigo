document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector(".form.login form");
  const errorMessage = document.getElementById("errorMessage");
  const successMessage = document.getElementById("successMessage");
  const googleBtn = document.getElementById("googleBtn");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorMessage.textContent = "";
      successMessage.textContent = "";

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!email || !password) {
        errorMessage.textContent = "Please fill in all fields.";
        return;
      }

      try {
        const response = await fetch("http://localhost:4000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, auth_provider: "email" }),
        });

        const data = await response.json();

        if (!response.ok) {
          errorMessage.textContent = data.message || "Login failed.";
          return;
        }

        localStorage.setItem("token", data.token);
        successMessage.textContent = "Login successful!";
        window.location.href = "src/pages/about.html";
      } catch (err) {
        errorMessage.textContent = "Error connecting to server.";
      }
    });
  }
});
