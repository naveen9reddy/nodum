import { NextResponse } from "next/server";
import { db } from "@/db";
import { requests } from "@/db/schema";
import { desc } from "drizzle-orm";

// export async function GET() {
//   try {
//     // Fetch latest 10 logs from Neon
//     const data = await db.select().from(requests).orderBy(desc(requests.id)).limit(10);
//     return NextResponse.json(data);
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
//   }
// }

export async function GET() {
    try {
      const logs = await db.select().from(requests).limit(50);
      return NextResponse.json(logs);
    } catch (error) {
      console.error("❌ /api/logs failed:", error);
      return NextResponse.json(
        { error: "Failed to fetch logs" },
        { status: 500 }
      );
    }
  }