const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("users");
const bcrypt = require("bcrypt");

const authenticateUser = async (req, res, next) => {
  const { name, password } = req.body;

  try {
    const user = await User.findOne({ name: name });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    req.session.user = {
      id: user._id,
      name: user.name,
    };

    next();
  } catch (err) {
    console.error("Authentication error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
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
    try {
      const user = await User.findOne({ name: req.body.name });
  
      if (user) {
        return res.status(401).json({ error: "Username is already taken." });
      } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const re=await new User({ name: req.body.name, password: hashedPassword }).save();
        res.send(re)
      }
    } catch (error) {
      console.error("Error during signup:", error);
      res.status(500).json({ error: "An error occurred while processing the request." });
    }
  });
  
};
