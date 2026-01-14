import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(req: Request) {
  try {
    const { amount, tip, campaignId } = await req.json();

    // Get the campaign to find who to pay
    const campaign = await db.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign || !campaign.stripeAccountId) {
      return NextResponse.json({ error: "Campaign setup incomplete" }, { status: 400 });
    }

    // CALCULATE FEES
    // Example: $100 Donation. 
    // You want 5% or $1 minimum.
    const feePercent = 0.05; 
    let myFee = amount * feePercent; // $5.00
    if (myFee < 1) myFee = 1;        // Minimum $1.00

    // Stripe expects cents (multiply by 100)
    const totalAmountCents = Math.round((amount + tip) * 100);
    const appFeeCents = Math.round(myFee * 100); 

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: campaign.currency.toLowerCase(), // USD, EUR, GBP
            product_data: {
              name: `Donation to ${campaign.title}`,
            },
            unit_amount: totalAmountCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL || "https://your-site.vercel.app"}/campaign/${campaignId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || "https://your-site.vercel.app"}/campaign/${campaignId}`,
      
      // THIS IS THE MAGIC PART (Stripe Connect)
      payment_intent_data: {
        application_fee_amount: appFeeCents, // Your Profit
        transfer_data: {
          destination: campaign.stripeAccountId, // The Campaign Creator's Account
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
