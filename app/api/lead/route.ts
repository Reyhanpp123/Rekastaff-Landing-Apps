import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Log the data
    // TODO: Implement actual storage (Prisma or Google Sheets API)
    console.log("New Lead Received:", body);
    
    return NextResponse.json({ message: "Lead submitted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
