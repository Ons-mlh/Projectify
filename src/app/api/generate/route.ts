import OpenAi from "openai";
import { buildPrompt } from "@/lib/buildPrompt";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAi({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  const prompt = buildPrompt(body);
  const models = [
    "google/gemma-3-27b-it:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "mistralai/mistral-7b-instruct:free",
    "deepseek/deepseek-r1:free",
  ];

  let response: any;

  for (const model of models) {
    try {
      response = await client.chat.completions.create({
        model: model,
        messages: [{ role: "user", content: prompt }],
      });
      break;
    } catch (err: any) {
      if (err.status === 429) {
        console.warn(`${model} is rate limited, trying next...`);
      }
    }
  }
  if (!response) {
    return NextResponse.json(
      {
        error:
          "All models are currently rate limited. Please try again in a few minutes.",
      },
      { status: 429 },
    );
  }

  const result = response.choices[0].message.content;
  return NextResponse.json({ result });
}
