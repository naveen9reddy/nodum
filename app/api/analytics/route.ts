import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { requests } from '@/db/schema';
import { sql, gte } from 'drizzle-orm';

export async function GET() {
  try {
    // 1. Requests over time
    const db = getDb();
    const timeData = await db
      .select({
        date: sql`DATE(${requests.timestamp})`.as('date'),
        count: sql<number>`count(*)`.as('count'),
      })
      .from(requests)
      .where(gte(requests.timestamp, sql`NOW() - INTERVAL '7 days'`))
      .groupBy(sql`DATE(${requests.timestamp})`)
      .orderBy(sql`date`);

    // 2. Model usage
    const modelData = await db
      .select({
        model: requests.model,
        count: sql<number>`count(*)`.as('count'),
      })
      .from(requests)
      .groupBy(requests.model);

    // 3. Status logic (FIXED: Grouping by the CASE statement directly)
    const statusLogic = sql`CASE WHEN ${requests.response} IS NOT NULL THEN 'success' ELSE 'error' END`;

    const errorData = await db
      .select({
        status: statusLogic.as('status'),
        count: sql<number>`count(*)`.as('count'),
      })
      .from(requests)
      .groupBy(statusLogic); // Use the logic here, not the alias 'status'

    return NextResponse.json({
      timeData,
      modelData,
      errorData
    });
  } catch (error: any) {
    console.error("Analytics Error:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}