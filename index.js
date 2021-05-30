const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const createCheckoutSession = require("./checkout");

const app = express();
const PORT = 4242;

app.use(express.json());
app.use(cors({ origin: true }));

// Routes
app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/create-checkout-session", createCheckoutSession);

app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
