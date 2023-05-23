// TODO (pdakin): Hide your API key.
// TODO (pdakin): Do we need to be worried about prompt injection?
// TODO (pdakin): Prompt should NOT be visible to the user - right now this is completely fucked
//                because of the client components theme issue.
// TODO (pdakin): Use named types.
// TODO (pdakin): API access will need to be asynchronous.

import { Configuration, OpenAIApi } from "openai";

export async function constructExtractionPrompt(corpus: string) {
  // TODO (pdakin): Corpus sanitization.
  const response = await fetch(
    "/prompts?" + new URLSearchParams({ name: "extract" })
  );
  const json = await response.json();
  const promptBase = json.base;
  return `${promptBase}
Input:
{
    "text": ${corpus};
}`;
}

async function constructRankingPrompt(extractionResult: {
  title: string;
  infoList: string[];
}) {
  const response = await fetch(
    "/prompts?" + new URLSearchParams({ name: "rank" })
  );
  const json = await response.json();
  const promptBase = json.base;
  return `${promptBase}
Input:
${JSON.stringify(extractionResult, null, 2)}`;
}

async function constructRewritePrompt(
  title: string,
  partialInfoListScored: (string | number)[][]
) {
  const response = await fetch(
    "/prompts?" + new URLSearchParams({ name: "rewrite" })
  );
  const json = await response.json();
  const promptBase = json.base;
  return `${promptBase}
Input:
${JSON.stringify({ title: title, info_list: partialInfoListScored }, null, 2)}`;
}

// TODO (pdakin): Should not re-establish connection to OpenAI multiple times on each call.
async function submitPrompt(prompt: string) {
  const configuration = new Configuration({
    // apiKey: process.env.OPENAI_API_KEY,
    apiKey: "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",
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
    presence_penalty: 0.0, // TODO (pdakin): Presence penalty worth using?
  });

  // TODO (pdakin): Handling errors from OpenAI.

  let response = result.data.choices[0];
  console.log(
    "Received OpenAI response with finish reason: ",
    response.finish_reason
  );
  if (!response.message) {
    console.log("Undefined message! This should never happen.");
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
  const prompt = await constructExtractionPrompt(corpus);

  const result = await submitPrompt(prompt);
  if (!result) {
    // TODO (pdakin): Do something better.
    console.error("Null extraction of OpenAI response, returning default.");
    return { title: "", infoList: [] };
  }
  return result;
}

async function rank(extractionResult: { title: string; infoList: string[] }) {
  const prompt = await constructRankingPrompt(extractionResult);
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
  const prompt = await constructRewritePrompt(title, partialInfoListScored);
  const result = await submitPrompt(prompt);
  if (!result) {
    // TODO (pdakin): Do something better.
    console.error("Null extraction of OpenAI response, returning default.");
    return "Rewrite failed!";
  }
  return result.text;
}

export function getTotalSummaryCount(infoListLength: number) {
  return Math.floor(Math.log2(infoListLength));
}

export async function summarize(
  setLoadingState: (arg: string) => void,
  corpus: string,
  callback: (
    infoListScored: (string | number)[][],
    pageEntries: string[],
    error?: boolean
  ) => void
) {
  try {
    // TODO (pdakin): It is really important this function is not called during render cycle to avoid
    // some API loop bug. How do I assert this?

    setLoadingState("Extracting data...");
    const extractResult = await extract(corpus);
    if (!extractResult) {
      callback([], [], true);
      return;
    }

    setLoadingState("Ranking results...");
    const infoListScored = await rank(extractResult);
    if (!infoListScored) {
      callback([], [], true);
      return;
    }

    const summaryCount = getTotalSummaryCount(infoListScored.length);
    const sortedInfoListScored = infoListScored
      .map((e: (string | number)[]) => e) // TODO (pdakin): Cleaner way to deep copy?
      .sort((l: (string | number)[], r: (string | number)[]) =>
        Number(l[1] < r[1])
      );

    // Summary at index zero is just the original text.
    let pageEntryPromises = [];
    setLoadingState("Writing summaries...");
    for (let i = 1; i < summaryCount; i++) {
      const numEntries = sortedInfoListScored.length / Math.pow(2, i);
      const text = rewrite(
        extractResult.title,
        sortedInfoListScored
          .slice(0, numEntries)
          .map((entry: (string | number)[]) => entry[0])
      );
      pageEntryPromises.push(text);
    }

    let pageEntries = [corpus];
    pageEntries = pageEntries.concat(await Promise.all(pageEntryPromises));

    for (const entry of pageEntries) {
      if (!entry) {
        callback([], [], true);
      }
    }

    // TODO (pdakin): Actually necessary to keep scored list in state?
    callback(infoListScored, pageEntries, false);
  } catch {
    callback([], [], true);
  }
}
