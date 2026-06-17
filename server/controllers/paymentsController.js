import Stripe from "stripe";
import User from "../models/User.js";
import Session from "../models/Session.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @route POST /api/payments/checkout — pay for a session
export const createCheckout = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await Session.findById(sessionId).populate("mentor", "name sessionPrice");
    if (!session) return res.status(404).json({ message: "Session not found" });

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: `Mentoring session with ${session.mentor.name}`, description: session.topic },
          unit_amount: session.price * 100,
        },
        quantity: 1,
      }],
      success_url: `${process.env.CLIENT_URL}/my-sessions?payment=success`,
      cancel_url: `${process.env.CLIENT_URL}/my-sessions?payment=cancelled`,
      metadata: { sessionId: sessionId.toString(), menteeId: req.user._id.toString() },
    });

    res.json({ url: stripeSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ message: "Payment failed. Please try again." });
  }
};

// @route POST /api/payments/subscribe — upgrade to Pro
export const subscribe = async (req, res) => {
  try {
    let customerId = req.user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({ email: req.user.email, name: req.user.name });
      customerId = customer.id;
      await User.findByIdAndUpdate(req.user._id, { stripeCustomerId: customerId });
    }

    const stripeSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: "MentorPath Pro", description: "Unlimited sessions per month" },
          unit_amount: 1500, // $15/month
          recurring: { interval: "month" },
        },
        quantity: 1,
      }],
      success_url: `${process.env.CLIENT_URL}/subscription?upgraded=true`,
      cancel_url: `${process.env.CLIENT_URL}/subscription`,
    });

    res.json({ url: stripeSession.url });
  } catch (error) {
    console.error("Subscribe error:", error);
    res.status(500).json({ message: "Subscription failed. Please try again." });
  }
};

// @route GET /api/payments/history
export const getHistory = async (req, res) => {
  try {
    const sessions = await Session.find({ mentee: req.user._id, isPaid: true })
      .populate("mentor", "name avatar")
      .sort({ createdAt: -1 });
    res.json({ payments: sessions });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
