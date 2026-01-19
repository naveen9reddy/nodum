import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { requests } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Parse the ID from the URL params
    const requestId = parseInt(params.id);
    const db = getDb();

    const result = await db
      .select()
      .from(requests)
      .where(eq(requests.id, requestId))
      .limit(1);

    if (!result.length) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}