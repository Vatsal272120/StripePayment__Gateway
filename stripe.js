const stripe = require("stripe")(process.env.STRIPE__SECRET_KEY);

module.exports = stripe;
