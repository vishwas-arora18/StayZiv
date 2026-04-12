const User = require("../models/user");

// 1. Render Signup Form
module.exports.renderSignupForm = (req, res) => {
    // Title add kiya
    res.render("users/signup.ejs", { title: "StayZiv | Join Our Community" });
};

// 2. Signup Logic
module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        console.log(req.body);
        const newUser = new User({
            username,
            email
        });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            // Message update kiya
            req.flash("success", "Welcome to StayZiv!");
            res.redirect("/listings");
        });

    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

// 3. Render Login Form
module.exports.renderLoginForm = (req, res) => {
    // Title add kiya
    res.render("users/login.ejs", { title: "StayZiv | Login to Your Account" });
};

// 4. Login Logic
module.exports.login = async (req, res) => {
    // Message update kiya
    req.flash("success", "Welcome back to StayZiv!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

// 5. Logout Logic
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are successfully logged out!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    })
};