const router = require("express").Router();
const User = require("../models/User");
// TO ENCRYPT / HASH PASSWORD
const CryptoJS = require("crypto-js");


// REGISTER

router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN iiinnn


module.exports = router;