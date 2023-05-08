require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors");;
app.use(express.json());
app.use(
  cors({
    origin: "http://127.0.0.1:5650",
  })
)

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      billing_address_collection: "required",
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: req.body.packageName,
          },
          unit_amount: req.body.price,
        },
        quantity: 1,
      }],
      success_url: `${process.env.CLIENT_URL}/success.html`,
      cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
    });
    res.json({ url: session.url })
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: e.message })
  }
})

app.listen(3000, () => {
  console.log('listening on port 3000')
})
