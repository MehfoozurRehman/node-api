const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");
const fileUpload = require("express-fileupload");
const apiKey = require("@vpriem/express-api-key-auth");

// api config
dotenv.config();
const app = express();
const port = process.env.PORT || 9000;
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: "Too many request",
  standardHeaders: true,
  legacyHeaders: false,
});
const speedLimiter = slowDown({
  windowMs: 1 * 60 * 1000,
  delayAfter: 10,
  delayMs: 100,
});

// middleware
app.enable("trust proxy");
app.use(express.json());
app.use(cors());
app.use(limiter); // app.use(speedLimiter);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
express().use(apiKey.apiKeyAuth(["my-api-key1", "my-api-key2"])); // x-api-key
app.use(express.static("public"));

// db config

mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("DB Connected");
  }
);

// api endpoints

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to api",
  });
});

app.post("/upload", function (req, res) {
  console.log(req.files.foo);
  //   <input name="foo" type="file" />
});

// listners
app.listen(port, () => {
  console.log("Api working");
});
