const stripeAPI = require("./stripe");

const createCheckoutSession = async (req, res) => {
  const domainURL = process.env.WEB_APP;

  const { line_items, customer_email } = req.body;

  // edge case check
  if (!line_items || !customer_email) {
    return res.status(400).json({ error: "Invalid params" });
  }

  let session;

  try {
    session = await stripeAPI.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: line_items,
      customer_email: customer_email,
      success_url: `${domainURL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainURL}/canceled`,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
};

module.exports = createCheckoutSession;
