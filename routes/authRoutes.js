const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("users");
const bcrypt = require("bcrypt");

const authenticateUser = async (req, res, next) => {
  const { name, password } = req.body;
  console.log(name);
  console.log(password);

  const user = await User.findOne({ name: name });

  try{

    if (!user || !password || !bcrypt.compareSync(password, user.password)) {
      return (req.session.user = {
        id: "",
        name: "",
      });
    } else {
      req.session.user = {
        id: user._id,
        name: user.name,
      };
    }
  }
  catch(err){
    console.log(err)
  }

  next();
};

module.exports = (app) => {
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      res.redirect("/");
    }
  );
  app.get("/api/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  app.get("/api/current_user", (req, res) => {
    res.send(req.user);
  });

  app.post("/api/login", authenticateUser, (req, res) => {
    console.log("logged");
    res.send(req.session.user);
  });

  app.post("/api/signup", async (req, res) => {
    const user = await User.findOne({ name: req.body.name });

    if (user) {
      return "Username is already taken.";
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await new User({ name: req.body.name, password: hashedPassword }).save();

    res.redirect("/auth/login");
  });
};
