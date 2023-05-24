// TODO (pdakin): Console seems like a bad way to log - what is a good way?

import { EXTRACT_BASE, RANK_BASE, REWRITE_BASE } from "./prompts";
import { OpenAI } from "openai-streams";
import { yieldStream } from "yield-stream";
import { NextRequest, NextResponse } from "next/server";

export function constructExtractionPrompt(corpus: string) {
  // TODO (pdakin): Consider sanitizing input.
  const promptBase = EXTRACT_BASE;
  return `${promptBase}
Input:
{
    "text": ${corpus};
}`;
}

function constructRankingPrompt(extractionResult: {
  title: string;
  infoList: string[];
}) {
  const promptBase = RANK_BASE;
  return `${promptBase}
Input:
${JSON.stringify(extractionResult, null, 2)}`;
}

function constructRewritePrompt(
  title: string,
  partialInfoListScored: (string | number)[][]
) {
  const promptBase = REWRITE_BASE;
  return `${promptBase}
Input:
${JSON.stringify({ title: title, info_list: partialInfoListScored }, null, 2)}`;
}

async function submitPrompt(prompt: string) {
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

  // TODO (pdakin): Add retries for robustness.
  // TODO (pdakin): See about exposing finish_reason on openai-streams.
  let response = "";
  for await (const chunk of yieldStream(stream)) {
    response += new TextDecoder().decode(chunk);
  }

  const extractedInfo = JSON.parse(response.substring(8));
  return extractedInfo;
}

async function extract(corpus: string) {
  const prompt = constructExtractionPrompt(corpus);
  const result = await submitPrompt(prompt);
  return result;
}

async function rank(extractionResult: { title: string; infoList: string[] }) {
  const prompt = constructRankingPrompt(extractionResult);
  const result = await submitPrompt(prompt);
  return result.info_list_scored;
}

async function rewrite(
  title: string,
  partialInfoListScored: (string | number)[][]
) {
  const prompt = constructRewritePrompt(title, partialInfoListScored);
  const result = await submitPrompt(prompt);
  return result.text;
}

export async function POST(request: NextRequest) {
  const requestInfo = await request.json();
  try {
    switch (requestInfo.type) {
      case "extract": {
        return NextResponse.json(await extract(requestInfo.corpus));
      }
      case "rank": {
        return NextResponse.json(await rank(requestInfo.extractionResult));
      }
      case "rewrite": {
        return NextResponse.json({
          text: await rewrite(requestInfo.title, requestInfo.infoListScored),
        });
      }
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}
