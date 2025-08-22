document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("signupEmail");
  const passwordInput = document.getElementById("signupPassword");
  const phoneInput = document.getElementById("phone_number");
  const addressInput = document.getElementById("address");

  const errorMessage = document.getElementById("errorMessage");
  const successMessage = document.getElementById("successMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Clear messages
    errorMessage.textContent = "";
    successMessage.textContent = "";

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const phone_number = phoneInput.value.trim();
    const address = addressInput.value.trim();

    // Basic validation
    if (!name || !email || !password || !phone_number || !address) {
      errorMessage.textContent = "All fields are required.";
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone_number,
          address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed.");
      }

      successMessage.textContent = "Signup successful!";
      // Store JWT in localStorage and set login status:
      localStorage.setItem("token", data.token);
      localStorage.setItem("userToken", "logged-in");
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          username: data.user?.username || name,
          email: data.user?.email || email,
          id: data.user?._id,
        })
      );

      // Redirect to about page after signup
      setTimeout(() => {
        window.location.href =
          "src/pages/about.html?message=" +
          encodeURIComponent("Signup successful! Welcome to VehiGo!") +
          "&type=success";
      }, 1500);
    } catch (error) {
      errorMessage.textContent = error.message;
    }
  });
});
