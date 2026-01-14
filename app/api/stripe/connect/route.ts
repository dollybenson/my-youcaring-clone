import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia", // Use latest version
});

export async function POST(req: Request) {
  try {
    const { campaignId } = await req.json();

    // 1. Create a "Connected Account" for the user
    const account = await stripe.accounts.create({
      type: "standard",
    });

    // 2. Save this account ID to their campaign in your database
    await db.campaign.update({
      where: { id: campaignId },
      data: { stripeAccountId: account.id },
    });

    // 3. Create a Link to send them to Stripe to finish signup
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_URL || "https://your-site.vercel.app"}/campaign/${campaignId}`,
      return_url: `${process.env.NEXT_PUBLIC_URL || "https://your-site.vercel.app"}/campaign/${campaignId}`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to connect Stripe" }, { status: 500 });
  }
}
