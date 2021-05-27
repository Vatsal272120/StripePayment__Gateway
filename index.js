const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv").config();

// local imports

//TODO: add stripe key
const stripe = require("stripe")(process.env.STRIPE__SECRET_KEY);

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.get("/", (req, res) => {
  res.send("works");
});

app.post("/create-checkout-session", async (req, res) => {
  // token that contains the info on the product and user
  const { order, token } = req.body;
  console.log("order", order);
  console.log("price", order.price);

  const session = await stripe.checkout.sessions.create({
    payment_method_type: ["card"],
    line_items: [
      {
        price_data: {
          currency: "INR",
          product_data: order,
          unit_amount: order.price * 100,
          quantity: order.quantity,
        },
      },
    ],

    mode: "payment",
    successUrl: process.env.url + "/success",
    cancel_url: process.env.url + "/cancel",
  });

  res.json({ id: session.id });
});

app.post("/payment", (req, res) => {
  // token that contains the info on the product and user
  const { order, token } = req.body;
  console.log("order", order);
  console.log("price", order.price);

  // unique key - that makes sure user dont get charge twice
  const idempontencykey = uuid.v4();

  // customer is created
  return stripe.customers
    .create({
      email: token.email,
      source: token.source,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: order.price * 100,
          currency: "inr",
          customer: customer.id,
          receipt_email: token.email,
          description: order.name,
        },
        { idempontencykey }
      );
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => console.log(err));
});

// listen
app.listen(process.env.PORT, () => console.log(`app on ${process.env.PORT}`));
