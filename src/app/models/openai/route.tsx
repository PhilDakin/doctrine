// TODO (pdakin): Hide your API key.
// TODO (pdakin): Do we need to be worried about prompt injection?
// TODO (pdakin): Prompt should NOT be visible to the user - right now this is completely fucked
//                because of the client components theme issue.
// TODO (pdakin): Use named types.
// TODO (pdakin): API access will need to be asynchronous.
// TODO (pdakin): Console seems like a bad way to log - what is a good way?

import { Configuration, OpenAIApi } from "openai";
import { EXTRACT_BASE, RANK_BASE, REWRITE_BASE } from "./prompts";
import { NextRequest, NextResponse } from "next/server";

function constructExtractionPrompt(corpus: string) {
  // TODO (pdakin): Corpus sanitization.
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
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const result = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0,
  });

  // TODO (pdakin): Handling errors from OpenAI.

  let response = result.data.choices[0];
  console.log(
    "Received OpenAI response with finish reason: ",
    response.finish_reason
  );
  if (!response.message) {
    console.error("Undefined message! This should never happen.");
    return;
  }

  try {
    const extractedInfo = JSON.parse(response.message.content.substring(8));
    return extractedInfo;
  } catch (extractionError) {
    console.error(
      "Failed to parse LLM response as JSON: ",
      response.message.content
    );
    return null;
  }
}

async function extract(corpus: string) {
  const prompt = constructExtractionPrompt(corpus);

  const result = await submitPrompt(prompt);
  if (!result) {
    // TODO (pdakin): Do something better.
    console.error("Null extraction of OpenAI response, returning default.");
    return { title: "", infoList: [] };
  }
  return result;
}

async function rank(extractionResult: { title: string; infoList: string[] }) {
  const prompt = constructRankingPrompt(extractionResult);
  const result = await submitPrompt(prompt);
  if (!result) {
    // TODO (pdakin): Do something better.
    console.error("Null extraction of OpenAI response, returning default.");
    return [];
  }
  return result.info_list_scored;
}

async function rewrite(
  title: string,
  partialInfoListScored: (string | number)[][]
) {
  const prompt = constructRewritePrompt(title, partialInfoListScored);
  const result = await submitPrompt(prompt);
  if (!result) {
    // TODO (pdakin): Do something better.
    console.error("Null extraction of OpenAI response, returning default.");
    return "Rewrite failed!";
  }
  return result.text;
}

export async function POST(request: NextRequest) {
  // TODO (pdakin): Is there a way to automatically handle malformed requests?
  const requestInfo = await request.json();
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
}
