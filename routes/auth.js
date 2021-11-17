const router = require("express").Router();


const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");


const saltRounds = 10;


const User = require("../models/User.model");


const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/loggedin", (req, res) => {
  res.json(req.user);
});

router.post("/signup", isLoggedOut, (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide your username." });
  }

  if (password.length < 6) {
    return res.status(400).json({
      errorMessage: "Your password needs to be at least 6 characters long.",
    });
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

  if (!regex.test(password)) {
    return res.status(500).json({
      errorMessage:
        "Password needs to have at least 6 characters and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }

  // Search the database for a user with the username submitted in the form
  User.findOne({ username }).then((found) => {
   
    if (found) {
      return res
        .status(400)
        .json("auth/signup", { errorMessage: "Username already taken." });
    }

   
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        
        return User.create({
          username,
          password: hashedPassword,
        });
      })
      .then((user) => {
      
        req.session.user = user;
        res.status(201).json(user);
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res.status(500).json({ errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(500).json({
            errorMessage:
              "Username need to be unique. The username you chose is already in use.",
          });
        }
        return res.status(500).json({ errorMessage: error.message });
      });
  });
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;

  if (!username) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide your username." });
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 6) {
    return res.status(400).json({
      errorMessage: "Your password needs to be at least 6 characters long.",
    });
  }

  
  User.findOne({ username })
    .then((user) => {
     
      if (!user) {
        return res.status(400).json({ errorMessage: "Wrong credentials." });
      }

      
      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res.status(400).json({ errorMessage: "Wrong credentials." });
        }
        req.session.user = user;
        
        return res.json(user);
      });
    })

    .catch((err) => {
      next(err);
      return res.status(500).render("login", { errorMessage: err.message });
    });
});

router.post("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ errorMessage: err.message });
    }
    res.status(200).json({ message: "You are logged out" });
  });
});

module.exports = router;
