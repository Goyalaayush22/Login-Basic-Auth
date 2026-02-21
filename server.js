const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
const User = require("./models/user");
const { isLoggedIn, isAdmin } = require("./authmiddleware");
const app = express();
app.use(require("cors")());

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: "sessionSecretKey",
    resave: false,
    saveUninitialized: false,
  }),
);

/* -------------------- DATABASE CONNECTION -------------------- */
mongoose
  .connect("mongodb://127.0.0.1:27017/sessionAuth")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

/* -------------------- SIGNUP -------------------- */
app.post("/signup", async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(500).json({
        success: false,
        message: "User Already Exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user (schema validation happens here)
    await User.create({
      name,
      phone,
      email,
      password: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      message: "Account created successfully",
    });
  } catch (error) {
    // mongoose validation error handling
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(200).json({
        success: false,
        message: messages.join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

/* -------------------- LOGIN -------------------- */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(500).json({
      success: false,
      message: "User not found",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(500).json({
      success: false,
      message: "Wrong Password",
    });
  }

  // create session
  req.session.userId = user._id;
  req.session.role = user.role;

  if (user.role === "admin") {
    return res.status(200).json({
      success: true,
      role: "admin",
    });
  } else {
    return res.status(200).json({
      success: true,
      role: "user",
    });
  }
});

/* -------------------- LOGOUT -------------------- */
app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Logout failed"
      });
    }

    res.clearCookie("connect.sid"); // important
    res.json({
      success: true,
      message: "Logged out successfully"
    });
  });
});

/* -------------------- SERVER -------------------- */
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

app.get("/admin", isLoggedIn, isAdmin, (req, res) => {
  res.sendFile(__dirname + "/views/admin.html");
});


app.get("/user", isLoggedIn, (req, res) => {
  res.sendFile(__dirname + "/views/user.html");
});