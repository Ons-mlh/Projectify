import OpenAi from "openai";
import { buildPrompt } from "@/lib/buildPrompt";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAi({
  baseURL: "https://models.github.ai/inference",
  apiKey: process.env.GITHUB_TOKEN,
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  const prompt = buildPrompt(body);

  let response: OpenAi.Chat.ChatCompletion | null = null;

  try {
    response = await client.chat.completions.create({
      model: "meta/Meta-Llama-3.1-405B-Instruct",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
    });
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };
    console.error("Full error:", JSON.stringify(error, null, 2));

    if (error.status === 429) {
      console.warn("llm model is rate limited, trying next...");
    }
    return NextResponse.json(
      { error: "Failed to generate projects" },
      { status: 500 }
    );
  }

  if (!response) {
    return NextResponse.json(
      { error: "No response from AI model" },
      { status: 500 }
    );
  }

  const result = response.choices[0].message.content;
  return NextResponse.json({ result });
}
