import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db";
import { requests } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const requestId = Number(id);

    if (Number.isNaN(requestId)) {
      return NextResponse.json(
        { error: "Invalid request id" },
        { status: 400 }
      );
    }

    const db = getDb();

    const result = await db
      .select()
      .from(requests)
      .where(eq(requests.id, requestId))
      .limit(1);

    if (!result.length) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("❌ GET /api/requests/[id] failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
