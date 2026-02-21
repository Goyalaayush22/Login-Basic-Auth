// login.js

document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault(); // stop page refresh

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {

            // role-based redirect
            if (data.role === "admin") {
                window.location.href = "/admin";
            } else {
                window.location.href = "/user";
            }

        } else {
            showToast(data.message);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        showToast("Server error");
    });
});

// toast.js

function showToast(message, type = "success") {
    const toast = document.getElementById("toast");

    toast.className = "a";
    toast.classList.add("show");

    if (type === "error") {
        toast.classList.add("toast-error");
    } else {
        toast.classList.add("toast-success");
    }

    toast.innerText = message;

    setTimeout(() => {
        toast.className = toast.className.replace("show", "");
    }, 3000);
}