const express = require("express");
const router = express.Router();


router.use("/", require("./home"));
router.use("/news", require("./news"));
router.use("/movies", require("./movies"));


module.exports = router