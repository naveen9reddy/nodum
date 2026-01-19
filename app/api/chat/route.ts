import { NextResponse } from "next/server";
import { getDb } from "@/db"; // Using your existing db helper
import { requests } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const { prompt, userId } = await req.json();
    const db = getDb();
    
    const startTime = Date.now();

    // 1. Simulate AI Work (Mocking a delay)
    // In a real app, this is where you'd call OpenAI
    await new Promise((resolve) => setTimeout(resolve, 800)); 
    
    const latency = Date.now() - startTime;
    const isSuccess = Math.random() > 0.1; // 90% success rate for variety

    // 2. Prepare Mock Data
    const mockResponse = isSuccess 
      ? `This is a mock response for: "${prompt.substring(0, 30)}..."`
      : null;

    // 3. Insert into Neon via Drizzle
    const newRequest = await db.insert(requests).values({
      userId: userId || "anonymous",
      model: "mock-gpt-4o",
      prompt: prompt,
      response: mockResponse,
      latencyMs: latency,
      status: isSuccess ? "success" : "error",
      tokensUsed: Math.floor(Math.random() * 500) + 50,
      cost: (Math.random() * 0.02).toFixed(6),
    }).returning();

    return NextResponse.json({ 
      success: true, 
      response: mockResponse,
      data: newRequest[0] 
    });

  } catch (error: any) {
    console.error("❌ API Chat Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}