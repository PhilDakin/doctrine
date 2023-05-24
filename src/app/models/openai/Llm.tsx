import { yieldStream } from "yield-stream";

function extractJson(text: string) {
  // Goal of this function is to be somewhat robust to minor variations in LLM output.
  const extracted = text.substring(
    text.indexOf("{"),
    text.lastIndexOf("}") + 1
  );
  return extracted;
}

async function streamToString(stream: ReadableStream): Promise<string> {
  const chunks: Array<any> = [];
  for await (let chunk of yieldStream(stream)) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  return buffer.toString("utf-8");
}

async function submit(body: Object, countCallback: (c: number) => void) {
  countCallback(0);
  const rsp = await fetch("/models/openai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (rsp.status !== 200) {
    console.log("Received error from server with status", rsp.status);
    throw Error("Error occurred on server!");
  } else {
    if (!rsp.body) {
      throw Error("Null body in success response!");
    }

    const forkedBody = rsp.body.tee();
    const decoder = new TextDecoder();

    let received = 0;
    for await (const chunk of yieldStream(forkedBody[0])) {
      const text = decoder.decode(chunk);
      received += text.length;
      countCallback(received);
    }

    const text = extractJson(await streamToString(forkedBody[1]));
    return JSON.parse(text);
  }
}

async function extract(corpus: string, countCallback: (c: number) => void) {
  return await submit(
    {
      type: "extract",
      corpus: corpus,
    },
    countCallback
  );
}

async function rank(
  extractionResult: { title: string; infoList: string[] },
  countCallback: (c: number) => void
) {
  return await submit(
    {
      type: "rank",
      extractionResult: extractionResult,
    },
    countCallback
  );
}

async function rewrite(
  title: string,
  partialInfoListScored: (string | number)[][],
  countCallback: (c: number) => void
) {
  const rsp = await submit(
    {
      type: "rewrite",
      title: title,
      infoListScored: partialInfoListScored,
    },
    countCallback
  );
  return rsp.text;
}

export function getTotalSummaryCount(infoListLength: number) {
  return Math.floor(Math.log2(infoListLength));
}

export async function summarize(
  setLoadingState: (arg: string) => void,
  setCount: (arg: number) => void,
  corpus: string,
  callback: (pageEntries: string[], error?: boolean) => void
) {
  try {
    setLoadingState("Extracting Data");
    const extractResult = await extract(corpus, setCount);

    setLoadingState("Ranking Results");
    const infoListScored = (await rank(extractResult, setCount))
      .info_list_scored;

    const summaryCount = getTotalSummaryCount(infoListScored.length);
    const sortedInfoListScored = infoListScored
      .map((e: (string | number)[]) => e) // TODO (pdakin): Cleaner way to deep copy?
      .sort((l: (string | number)[], r: (string | number)[]) =>
        Number(l[1] < r[1])
      );

    // Summary at index zero is just the original text.
    let pageEntries = [corpus];
    for (let i = 1; i < summaryCount; i++) {
      setLoadingState("Writing Summary " + i + "/" + (summaryCount - 1));
      const numEntries = sortedInfoListScored.length / Math.pow(2, i);
      // TODO (pdakin): Resolve issue with concurrent requests when using streaming API incl. count agg.
      const text = await rewrite(
        extractResult.title,
        sortedInfoListScored
          .slice(0, numEntries)
          .map((entry: (string | number)[]) => entry[0]),
        setCount
      );
      pageEntries.push(text);
    }

    callback(pageEntries, false);
  } catch (error) {
    console.error(error);
    callback([], true);
  }
}
