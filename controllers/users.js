const User = require("../models/user");

module.exports.renderSignUp = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signUp = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
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

module.exports.login=  async (req, res) => {
    req.flash("success", "Welcome to the WanderLust");
    res.redirect(res.locals.redirectUrl || "/listings");
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