import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const campaign = await db.campaign.create({
      data: {
        title: body.title,
        description: body.description, // Short summary
        story: body.story,             // Long story
        goal: body.goal,
        currency: body.currency,       // USD, EUR, GBP
        organizer: body.organizer,
        imageUrl: body.imageUrl,
        raised: 0,
      },
    });
    
    return NextResponse.json(campaign);
  } catch (error) {
    console.error("Create Error:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
