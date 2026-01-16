import { NextResponse } from "next/server";
import {  getDb } from "@/db";
import { requests } from "@/db/schema";
import { desc } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET() {
  try {
    const db = getDb();
    const logs = await db
      .select()
      .from(requests)
      .orderBy(requests.timestamp)
      .limit(50);

    return NextResponse.json(logs);
  } catch (error) {
    console.error("❌ /api/logs failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
