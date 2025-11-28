"use server";

import { NextRequest, NextResponse } from "next/server";
import { fetchArticles, fetchMockArticles } from "@/lib/openai/articles";
import { ENVIRONMENT } from "@/constant/env";

export async function POST(req: NextRequest) {
  if (ENVIRONMENT !== "PRODUCTION") {
    const articles = fetchMockArticles();
    return NextResponse.json({ articles }, { status: 200 });
  }

  try {
    const { suggestedQuery } = await req.json();

    if (!suggestedQuery || typeof suggestedQuery !== "string") {
      return NextResponse.json(
        { error: "suggestedQuery must be a non-empty string" },
        { status: 400 }
      );
    }

    const { articles, error } = await fetchArticles(suggestedQuery);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ articles }, { status: 200 });
  } catch (err) {
    console.error("API /articles/v1 :: Error:", err);
    return NextResponse.json(
      { error: "Invalid request or internal error" },
      { status: 500 }
    );
  }
}
