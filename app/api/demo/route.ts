import { NextResponse } from "next/server";
import { Effect } from "effect";
import { getDb } from "@/db";
import { requests } from "@/db/schema";

export async function POST(req: Request) {
  const { prompt, userId } = await req.json();

  const program = Effect.gen(function* (_) {
    const start = Date.now();

    // 1. Simulate AI Processing (Mocking 400ms to 1200ms delay)
    const delay = Math.floor(Math.random() * 800) + 400;
    yield* _(Effect.sleep(`${delay} millis`));

    // 2. Simulate Random Success/Failure (90% success rate)
    const isSuccess = Math.random() > 0.1;
    const aiResponse = isSuccess 
      ? `Mock Response for: "${prompt.substring(0, 20)}..."` 
      : null;
    
    const latency = Date.now() - start;
    const status = isSuccess ? "success" : "error";

    // 3. Record the Trace to Neon
    yield* _(
      Effect.tryPromise({
        try: () => getDb().insert(requests).values({
          userId: userId || "demo-user",
          model: "mock-gpt-4o",
          prompt: prompt,
          response: aiResponse,
          latencyMs: latency,
          status: status,
          tokensUsed: Math.floor(prompt.length / 3),
          cost: (Math.random() * 0.01).toFixed(6),
        }),
        catch: (e) => new Error("Database logging failed")
      })
    );

    return { response: aiResponse, status };
  });

  try {
    const result = await Effect.runPromise(program);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Trace failed" }, { status: 500 });
  }
}