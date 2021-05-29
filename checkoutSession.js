const stripe = require("./stripe");

const createCheckoutSession = async (req, res) => {
  // domain url
  const domainUrl = process.env.WEB_APP_URL;

  // request parameters
  const { line_items, customer_email } = req.body;

  //edge case check
  if (!line_items || !customer_email) {
    return res
      .status(400)
      .json({ error: "missing required session parameters" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      customer_email,
      success_url: `${domainUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainUrl}/canceled`,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: `an error occurred while checkout` });
  }
};

module.exports = createCheckoutSession;
