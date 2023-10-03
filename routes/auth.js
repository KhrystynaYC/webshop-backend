const router = require("express").Router();
const User = require("../models/User");
// TO ENCRYPT / HASH PASSWORD
const CryptoJS = require("crypto-js");
// TO ASSIGN JWT TO PARTICULAR USERS / GIVE THEAM ACCESS
const jwt = require("jsonwebtoken");

// REGISTER

router.post("/register", async (req, res) => {
  // Create a new User instance with encrypted password
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    // Save the new user to the database
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN

router.post("/login", async (req, res) => {
  try {
    // Find a user by the provided username
    const user = await User.findOne(
      {
          username: req.body.username
      }
    );

    if (!user) return res.status(401).json("Wrong Usernmame!");
      // Decrypt the stored hashed password and compare with input password
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
  );


  const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

  const inputPassword = req.body.password;

  if (originalPassword != inputPassword) return res.status(401).json("Wrong Password");
  // Create a JWT for authentication
  const accessToken = jwt.sign(
    {
      id: user._id,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SEC,
    {expiresIn: "3d"}
  );
  // Return user data excluding the password and the access token
  const { password, ...others } = user._doc;
  res.status(200).json({...others, accessToken});

  } catch (err) {
    res.status(500).json(err);
  }
})

module.exports = router;