const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const userController = require("../controllers/users.js");
const wrapAsync = require("../utils/wrapAsync.js");

router.route("/signup")
.get(userController.renderSignup)
.post( wrapAsync(userController.signup));


router.route("/login")
.get(userController.renderLogin)
.post(
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login"
  }),userController.login
);

// Logout
router.get("/logout", userController.logout);

module.exports = router;   // ✅ THIS LINE IS CRITICAL
