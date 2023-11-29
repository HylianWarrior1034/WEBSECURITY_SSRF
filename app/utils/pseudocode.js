// analyze request body

const express = require("express");
const router = express.Router();
const fs = require("fs");

const valid = (type, req) => {
  // if type of website == 0 (web server that only serves direct external requests)
  // // only get requests are possible, so just use the dynamic allow-list
  // if type of website == 1 (web server that serves only local request)
  // // check if the web server serves primarily GET/POST requests. E.g. reject POST requests if web server only accepted GET requests previously
  // // if it's a GET request, go through blacklist and dynamic allow list
  // // if it's a POST request, check request body length and content types and reject anomalies
};

router.post("/", (req, res) => {
  try {
    var uri = new URL(req.body.url);

    if (allowlist.includes(uri.host)) {
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

router.get("/");
