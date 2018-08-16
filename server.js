const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "build")));

console.log("__dirname: ", __dirname);
app.get("*", function(req, res) {
  console.log("__dirname: ", __dirname);
  res.sendFile("./build/index.html");
});

const PORT = process.env.PORT || 9000;
app.listen(PORT);
