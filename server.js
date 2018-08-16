const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "build")));

app.get("*", function(req, res) {
  console.log("__dirname: ", __dirname);
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 9000;
app.listen(PORT);
