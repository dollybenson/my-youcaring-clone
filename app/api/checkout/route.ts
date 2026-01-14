import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(req: Request) {
  try {
    const { amount, tip, campaignId } = await req.json();

    const campaign = await db.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign || !campaign.stripeAccountId) {
      return NextResponse.json({ error: "Campaign setup incomplete" }, { status: 400 });
    }

    // CALCULATE YOUR APPLICATION FEE (5% or $1 min)
    const feePercent = 0.05; 
    let myFee = amount * feePercent; 
    if (myFee < 1) myFee = 1;

    const totalAmountCents = Math.round((amount + tip) * 100);
    const appFeeCents = Math.round(myFee * 100); 

    // DIRECT CHARGE SESSION
    const session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: campaign.currency.toLowerCase(),
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
        
        // YOUR PROFIT (Stripe takes their fees from the remaining amount)
        payment_intent_data: {
          application_fee_amount: appFeeCents,
        },
      },
      // THIS HEADER IS THE KEY FOR DIRECT CHARGES
      {
        stripeAccount: campaign.stripeAccountId, 
      }
    );

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
