const router = require("express").Router();
const User = require("../models/User");
// TO ENCRYPT / HASH PASSWORD
const CryptoJS = require("crypto-js");


// REGISTER

router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.SHA3(req.body.password).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne(
      {
          username: req.body.username
      }
    );
    if(!user ) {
      res.status(401).json("Wrong Credentials");
    }else {
      const hashedPassword = CryptoJS.SHA3(
        req.body.password
      );
      if (user.password !== hashedPassword.toString()) {
        res.status(401).json("Wrong Credentials");
      }else{
        res.status(200).json(user);
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
})

module.exports = router;