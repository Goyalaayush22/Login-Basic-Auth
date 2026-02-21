// logout.js

function logout() {
    fetch("http://localhost:3000/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include" // important if using session/cookies
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = "/index.html"; // back to login
        } else {
            showToast(data.message || "Logout failed");
        }
    })
    .catch(error => {
        console.error("Logout error:", error);
        showToast("Server error during logout");
    });
}