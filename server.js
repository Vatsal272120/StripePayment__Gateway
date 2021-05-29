const express = require("express");
const cors = require("cors");
const createCheckoutSession = require("./checkoutSession");
require("dotenv").config({ path: "./.env" });

const app = express();
const port = 8080;

// middleware
app.use(
  express.json({
    verify: (req, res, buffer) => (req["rawBody"] = buffer),
  })
);

app.use(cors({ origin: true }));

// routes

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/create-checkout-session", createCheckoutSession);

// listen
app.listen(port, () => console.log("server listening on port", port));
