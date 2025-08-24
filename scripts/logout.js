// Check login status and show appropriate buttons
function checkLoginStatus() {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userToken = localStorage.getItem("userToken");
  const token = localStorage.getItem("token");
  const vehigoSession = localStorage.getItem("vehigoSession");

  console.log("Checking login status:", {
    userToken,
    token,
    vehigoSession,
    loginBtn,
    logoutBtn,
  }); // Debug log

  // Check if user is logged in with any of the token systems
  if (userToken || token || vehigoSession) {
    console.log("User is logged in - showing logout button"); // Debug log
    // User is logged in - show logout button, hide login button
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
  } else {
    console.log("User is not logged in - showing login button"); // Debug log
    // User is not logged in - show login button, hide logout button
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
  }
}

// Handle logout
document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");

  // Check login status on page load
  checkLoginStatus();

  // Handle logout click
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      console.log("Logout button clicked"); // Debug log

      try {
        // Call backend logout endpoint
        const response = await fetch("http://localhost:4000/logout", {
          method: "GET",
          credentials: "include", // Include cookies for authentication
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Logout response status:", response.status); // Debug log

        if (response.ok) {
          const result = await response.json();
          console.log("Logout result:", result); // Debug log

          if (result.success) {
            // Clear local storage (all possible token keys)
            localStorage.removeItem("userToken");
            localStorage.removeItem("userInfo");
            localStorage.removeItem("token");
            localStorage.removeItem("vehigoSession");
            localStorage.removeItem("vehigoUser");
            sessionStorage.removeItem("userToken");
            sessionStorage.removeItem("userInfo");
            sessionStorage.removeItem("token");

            // Update UI immediately
            checkLoginStatus();

            // Determine the correct redirect path based on current page
            const currentPath = window.location.pathname;
            let redirectPath;

            if (currentPath.includes("/src/pages/")) {
              // We're in a page in the src/pages folder
              redirectPath = "./login.html";
            } else {
              // We're at the root level
              redirectPath = "src/pages/login.html";
            }

            // Redirect to login page with success message
            window.location.href =
              redirectPath +
              "?message=" +
              encodeURIComponent(result.message || "Logged out successfully") +
              "&type=success";
          } else {
            // Handle logout failure
            alert(result.message || "Logout failed");
          }
        } else {
          // If response is not ok (like 404 for unauthenticated user), still clear local data
          console.log("Backend logout failed, clearing local data anyway");

          // Clear local storage anyway
          localStorage.removeItem("userToken");
          localStorage.removeItem("userInfo");
          localStorage.removeItem("token");
          localStorage.removeItem("vehigoSession");
          localStorage.removeItem("vehigoUser");
          sessionStorage.removeItem("userToken");
          sessionStorage.removeItem("userInfo");
          sessionStorage.removeItem("token");

          // Update UI immediately
          checkLoginStatus();

          // Determine the correct redirect path based on current page
          const currentPath = window.location.pathname;
          let redirectPath;

          if (currentPath.includes("/src/pages/")) {
            // We're in a page in the src/pages folder
            redirectPath = "./login.html";
          } else {
            // We're at the root level
            redirectPath = "src/pages/login.html";
          }

          window.location.href =
            redirectPath +
            "?message=" +
            encodeURIComponent("Logged out successfully") +
            "&type=success";
        }
      } catch (error) {
        console.error("Logout error:", error);
        // Even if backend call fails, clear local data and redirect
        localStorage.removeItem("userToken");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
        localStorage.removeItem("vehigoSession");
        localStorage.removeItem("vehigoUser");
        sessionStorage.removeItem("userToken");
        sessionStorage.removeItem("userInfo");
        sessionStorage.removeItem("token");

        // Update UI immediately
        checkLoginStatus();

        // Determine the correct redirect path based on current page
        const currentPath = window.location.pathname;
        let redirectPath;

        if (currentPath.includes("/src/pages/")) {
          // We're in a page in the src/pages folder
          redirectPath = "./login.html";
        } else {
          // We're at the root level
          redirectPath = "src/pages/login.html";
        }

        window.location.href =
          redirectPath +
          "?message=" +
          encodeURIComponent("Logged out successfully") +
          "&type=success";
      }
    });
  } else {
    console.log("Logout button not found"); // Debug log
  }
});

// Also check immediately when script loads (in case DOMContentLoaded already fired)
checkLoginStatus();
