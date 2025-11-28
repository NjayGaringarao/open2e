"use server";

import { NextRequest, NextResponse } from "next/server";
import { chat, getMockChat } from "@/lib/openai/chat";
import { InputMessage } from "@/types/chat";
import { ENVIRONMENT } from "@/constant/env";

export async function POST(req: NextRequest) {
  if (ENVIRONMENT !== "PRODUCTION") {
    const { reply } = getMockChat();
    return NextResponse.json({ reply }, { status: 200 });
  }

  try {
    const { conversation } = await req.json();

    if (!Array.isArray(conversation) || conversation.length === 0) {
      return NextResponse.json(
        { error: "Conversation must be a non-empty array" },
        { status: 400 }
      );
    }

    // Type-check to ensure messages have role/content
    if (!conversation.every((msg) => msg.role && msg.content)) {
      return NextResponse.json(
        { error: "Each message must have a role and content" },
        { status: 400 }
      );
    }

    const { reply, error } = await chat(conversation as InputMessage[]);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ reply }, { status: 200 });
  } catch (err) {
    console.error("API /chat/v1 :: Error:", err);
    return NextResponse.json(
      { error: "Invalid request or internal error" },
      { status: 500 }
    );
  }
}
