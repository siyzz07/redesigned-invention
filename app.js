const express = require("express");
const app = express();
require("dotenv").config();

const flash = require("connect-flash");
app.use(flash());

const mongoose = require("mongoose");


const nocache=require('nocache');
    app.use(nocache())
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("connected to databaase..."))
  .catch((err) => console.log("could not connect database"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// for user route
const userRoute = require("./router/userRoute");
app.use("/", userRoute);

const port = process.env.port || 7000;

app.listen(port, () => console.log(`server is running on port ${port}`));
