//express
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 5000;

//file setup
var bodyParser = require("body-parser");

//password hash
//mongo setup
//mongo specifics

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build/index.html"));
});
const userRoutes = require("./userRoutes");
app.use(userRoutes);
app.listen(port, () => {
  console.log("- Server up!");
});
