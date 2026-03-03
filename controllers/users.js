const User = require("../models/user");

module.exports.renderSignUp = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signUp = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username, wishlist: [] });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to WanderLust");
        res.redirect("/listings");
      });
      // console.log(registeredUser);
    } catch (e) {
      req.flash("error", "User is already registered");
      res.redirect("/signup");
    }
  };

module.exports.renderLogIn = async (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  console.log("✅ Login successful for user:", req.user.username);
  req.flash("success", "Welcome back to WanderLust");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  console.log("🔄 Redirecting to:", redirectUrl);
  res.redirect(redirectUrl);
};

  module.exports.logOut=  (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};