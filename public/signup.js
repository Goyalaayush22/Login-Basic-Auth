// signup.js

document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault(); // stop page refresh

    const name = document.getElementById("name").value;
    const mobile = document.getElementById("mobile").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // basic validation
    if(password.length < 8){
        showToast("Passwords can not be less than 8 characters");
        return;
    }
    if(password.length > 12){
        showToast("Passwords can not be more than 12 characters");
        return;
    }
    if (password !== confirmPassword) {
        showToast("Passwords do not match");
        return;
    }

    fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            phone: mobile,
            email: email,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast("Account created successfully");
            window.location.href = "index.html"; // go to login
        } else {
            showToast(data.message || "Signup failed");
        }
    })
    .catch(error => {
        showToast("Server error",error );
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