function isLoggedIn(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect("/index.html");
  }
}

function isAdmin(req, res, next) {
  if (req.session.role === "admin") {
    next();
  } else {
    res.status(403).send("Access denied");
  }
}

module.exports = { isLoggedIn, isAdmin };