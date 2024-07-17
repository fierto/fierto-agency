import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import isAdminUser from "@/lib/isAdminUser";
import { error } from "console";

export async function GET(req: NextRequest) {
  try {
    const listings = await db.listing.findMany({
      take: 10,
    });

    return NextResponse.json(listings);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await isAdminUser();

    const body = await req.json();
    Object.values(body).forEach((v) => {
      if (v === "") return NextResponse.json({ error: "Fill all fields!" });
    });

    const {
      name,
      location,
      desc,
      type,
      pricePerNight,
      beds,
      hasFreeWifi,
      imageUrls,
    } = body;

    const newListing = await db.listing.create({
      data: {
        name,
        location,
        desc,
        type,
        pricePerNight,
        beds,
        hasFreeWifi,
        imageUrls,
      },
    });

    return NextResponse.json(newListing);
  } catch (error) {
    return NextResponse.json(error);
  }
}
