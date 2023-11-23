const express = require("express");
const router = express.Router();
const prisma = require("../prisma/client");
const thresholding = require("../utils/threshold");

router.post("/", async (req, res) => {
  const stored = await thresholding.storeRequest(
    req.body.url,
    req.body,
    req.ip
  );
  if (stored) {
    return res.status(200).json({ msg: "added" });
  } else {
    return res.status(400).json({ msg: "Too soon" });
  }
});

router.post("/hasThreshold", async (req, res) => {
  const result = await thresholding.runBFT(req.body.url);
  if (result) {
    return res.status(200).json({ msg: "passed" });
  } else {
    return res.status(400).json({ msg: "Failed" });
  }
});

module.exports = router;
