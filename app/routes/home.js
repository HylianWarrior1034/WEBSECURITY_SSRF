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
    const allowList = await thresholding.allowList(uri.host);
    const blockList = await thresholding.blockList(uri.host);

    const allowed1 = await thresholding.runBFT(uri.host);

    const allowed2 = await thresholding.checkReqBody(req.body, uri.host);

    const allowedStatus = "not allowed";

    if (allowList || (!blockList && allowed1 && allowed2)) {
      allowedStatus = "allowed";
    } else {
      allowedStatus = "not allowed";
    }
  } catch {
    allowedStatus = "an invalid url";
  }

  res.render("pages/check", {
    title: "Check Home",
    url: req.body.url,
    allowed: allowedStatus,
  });
});

module.exports = router;
