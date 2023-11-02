const express = require("express");
const router = express.Router();
const fs = require("fs");

let allowlist = fs
  .readFileSync("./allowlist.txt")
  .toString("UTF8")
  .replace(/\r/g, "")
  .split("\n");

router.get("/", (req, res) => {
  res.render("pages/news", {
    title: "News",
  });
});

router.post("/", (req, res) => {
  try {
    var uri = new URL(req.body.url);
    if (allowlist.includes(uri.host)) {
      res.render("pages/check", {
        title: "Check News",
        url: req.body.url,
        allowed: "allowed",
      });
    } else {
      res.render("pages/check", {
        title: "Check News",
        url: req.body.url,
        allowed: "not allowed",
      });
    }
  } catch {
    res.render("pages/check", {
      title: "Check News",
      url: req.body.url,
      allowed: "an invalid url",
    });
  }
});

module.exports = router;
