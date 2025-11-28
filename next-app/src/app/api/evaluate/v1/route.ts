"use server";

import { NextRequest, NextResponse } from "next/server";
import { evaluate, mockEvaluation } from "@/lib/openai/evaluate";
import { ENVIRONMENT } from "@/constant/env";

export async function POST(req: NextRequest) {
  if (ENVIRONMENT !== "PRODUCTION") {
    const { totalScore = 10 } = await req
      .json()
      .catch(() => ({ totalScore: 10 }));
    const result = mockEvaluation(totalScore);
    return NextResponse.json({ result }, { status: 200 });
  }

  try {
    const {
      question,
      answer,
      rubric,
      totalScore = 10,
    }: {
      question: string;
      answer: string;
      rubric: string;
      totalScore?: number;
    } = await req.json();

    if (!question || !answer || !rubric) {
      return NextResponse.json(
        { error: "Question, answer, and rubrics are required" },
        { status: 400 }
      );
    }

    const { result, error } = await evaluate({
      question,
      answer,
      rubric,
      totalScore,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ result }, { status: 200 });
  } catch (err) {
    console.error("API /evaluate/v1 :: Error:", err);
    return NextResponse.json(
      { error: "Invalid request or internal error" },
      { status: 500 }
    );
  }
}
