"use server";

import { NextRequest, NextResponse } from "next/server";
import { detectAI, mockDetectAI } from "@/lib/sapling/detection";
import { ENVIRONMENT } from "@/constant/env";

export async function POST(req: NextRequest) {
  if (ENVIRONMENT !== "PRODUCTION") {
    const detectionResult = mockDetectAI();
    return NextResponse.json(
      {
        overall_score: detectionResult.overall_score,
        sentence_scores: detectionResult.sentence_scores,
        tokens: detectionResult.tokens,
        token_probs: detectionResult.token_probs,
        message: detectionResult.message,
      },
      { status: 200 }
    );
  }

  try {
    const { answer } = await req.json();

    if (!answer || typeof answer !== "string") {
      return NextResponse.json(
        { error: "Answer must be a non-empty string" },
        { status: 400 }
      );
    }

    const detectionResult = await detectAI(answer);

    if (detectionResult.error) {
      return NextResponse.json(
        { error: detectionResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        overall_score: detectionResult.overall_score,
        sentence_scores: detectionResult.sentence_scores,
        tokens: detectionResult.tokens,
        token_probs: detectionResult.token_probs,
        message: detectionResult.message,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("API /detectAI/v1 :: Error:", err);
    return NextResponse.json(
      { error: "Invalid request or internal error" },
      { status: 500 }
    );
  }
}
