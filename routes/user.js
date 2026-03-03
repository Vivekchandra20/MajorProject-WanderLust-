const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/users");

router.get("/", (req, res) => {
  res.redirect("/listings");
});

router
  .route("/signup")
  .get(userController.renderSignUp)
  .post(wrapAsync(userController.signUp));

router
  .route("/login")
  .get( userController.renderLogIn)
  .post(
    (req, res, next) => {
      console.log("\n🔐 ===== LOGIN ATTEMPT =====");
      console.log("📝 Username provided:", req.body.username ? "yes" : "no");
      console.log("📝 Username value:", req.body.username);
      console.log("📝 Password provided:", req.body.password ? "yes" : "no");
      
      if (!req.body.username || !req.body.password) {
        console.log("❌ Missing username or password!");
        req.flash("error", "Please provide both username and password");
        return res.redirect("/login");
      }
      next();
    },
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

router.get("/logout", userController.logOut);

module.exports = router;
