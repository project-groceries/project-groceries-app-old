const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "build")));

app.use((req, res, next) => {
  const forwardedProtocol = req.headers["x-forwarded-proto"];
  if (forwardedProtocol && forwardedProtocol != "https") {
    res.redirect(`https://${req.hostname}${req.url}`);
  } else {
    res.append(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );

    next();
  }
});

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// const PORT = process.env.PORT || 80;
// console.log("port is", PORT);
app.listen(80);
