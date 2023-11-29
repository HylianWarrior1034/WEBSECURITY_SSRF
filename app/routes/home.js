const express = require("express");
const router = express.Router();
const thresholding = require("../utils/threshold");
const fs = require("fs");

let allowlist = fs
  .readFileSync("./allowlist.txt")
  .toString("UTF8")
  .replace(/\r/g, "")
  .split("\n");

router.get("/", (req, res) => {
  res.render("pages/index", {
    title: "Home",
  });
});

router.post("/", async (req, res) => {
  try {
    var uri = new URL(req.body.url);
    const stored = await thresholding.storeRequest(uri.host, req.body, req.ip);
    const allowed = await thresholding.runBFT(uri.host);
    if (allowed) {
      res.render("pages/check", {
        title: "Check Home",
        url: req.body.url,
        allowed: "allowed",
      });
    } else {
      res.render("pages/check", {
        title: "Check Home",
        url: req.body.url,
        allowed: "not allowed",
      });
    }
  } catch {
    res.render("pages/check", {
      title: "Check Home",
      url: req.body.url,
      allowed: "an invalid url",
    });
  }
});

module.exports = router;