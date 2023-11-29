const express = require("express");
const router = express.Router();
const prisma = require("../prisma/client");
s;
router.get("/", async (req, res) => {
  const request = await prisma.request.findMany({});
  return res.status(200).json({ request });
});

router.get("/afterDate/:date", async (req, res) => {
  const date = req.params.date;
  const dateObj = new Date(date);
  if (!dateObj) {
    return res.status(400).json({ msg: "Invalid Date" });
  }
  const request = await prisma.request.findMany({
    where: {
      createdAt: {
        lte: new Date(date),
      },
    },
  });
  return res.status(200).json({ request });
});

router.get("/allowList", async (req, res) => {
  //TODO
  const allowList = await prisma.allowList.findMany({});
  return res.status(200).json({ allowList });
});

router.get("/unallowList", async (req, res) => {
  //TODO
  const unallowList = await prisma.blockList.findMany({});
  return res.status(200).json({ unallowList });
});

module.exports = router;
