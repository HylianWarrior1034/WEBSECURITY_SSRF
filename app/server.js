const express = require("express");
const ejs = require("ejs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(
    cors({
        origin: "http://localhost:5000",
    })
);

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log("Server started on port 3000");
});

app.use(require("./routes"));
