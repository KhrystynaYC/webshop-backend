const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DBConnection Successfulllll yeeeah!"))
  .catch((err) => {console.log(err)});

// To get response from Postman. Testing purposes
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);



app.listen(process.env.PORT || 5000, () => {
  console.log("BAKEND is running!");
});