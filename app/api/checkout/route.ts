// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const { amount, tip, campaignId } = await req.json();

    // 1. Validate Campaign Exists
    const campaign = await db.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign) return new NextResponse("Campaign not found", { status: 404 });

    // 2. Create Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `Donation to ${campaign.title}` },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Tip to Platform" },
            unit_amount: tip * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/campaign/${campaignId}?success=true`,
      cancel_url: `${req.headers.get("origin")}/campaign/${campaignId}?canceled=true`,
      metadata: {
        campaignId: campaignId,
        donationAmount: amount, // Store original amounts for webhook processing
        tipAmount: tip
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[CHECKOUT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
