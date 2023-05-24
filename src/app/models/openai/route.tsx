// TODO (pdakin): Console seems like a bad way to log - what is a good way?

import {
  constructExtractionPrompt,
  constructRankingPrompt,
  constructRewritePrompt,
} from "./prompts";
import { OpenAI } from "openai-streams";
import { NextRequest, NextResponse } from "next/server";

async function submitPrompt(prompt: string) {
  // TODO (pdakin): Add retries for robustness.
  // TODO (pdakin): See about exposing finish_reason on openai-streams.
  const stream = await OpenAI("chat", {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0,
  });
  return stream;
}

async function extract(corpus: string) {
  const prompt = constructExtractionPrompt(corpus);
  return await submitPrompt(prompt);
}

async function rank(extractionResult: { title: string; infoList: string[] }) {
  const prompt = constructRankingPrompt(extractionResult);
  return await submitPrompt(prompt);
}

async function rewrite(
  title: string,
  partialInfoListScored: (string | number)[][]
) {
  const prompt = constructRewritePrompt(title, partialInfoListScored);
  return await submitPrompt(prompt);
}

export async function POST(request: NextRequest) {
  const requestInfo = await request.json();
  try {
    switch (requestInfo.type) {
      case "extract": {
        return new NextResponse(await extract(requestInfo.corpus));
      }
      case "rank": {
        return new NextResponse(await rank(requestInfo.extractionResult));
      }
      case "rewrite": {
        return new NextResponse(
          await rewrite(requestInfo.title, requestInfo.infoListScored)
        );
      }
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}
