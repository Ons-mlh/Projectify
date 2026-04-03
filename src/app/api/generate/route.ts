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

  let response: any;

    try {
      response = await client.chat.completions.create({
        model: "meta/Meta-Llama-3.1-405B-Instruct",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
      });

    } catch (err: any) {
        console.error("Full error:", JSON.stringify(err, null, 2))
      if (err.status === 429) {
        console.warn(`llm model is rate limited, trying next...`);
      }
    }

  const result = response.choices[0].message.content;
  console.log(result);
  return NextResponse.json({ result });
}
