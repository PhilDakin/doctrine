const PREFIX_LENGTH = 8; // "Output:\n"

async function submit(body: Object) {
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
    const text = await rsp.text();
    return JSON.parse(text.substring(PREFIX_LENGTH));
  }
}

async function extract(corpus: string) {
  return await submit({
    type: "extract",
    corpus: corpus,
  });
}

async function rank(extractionResult: { title: string; infoList: string[] }) {
  return await submit({
    type: "rank",
    extractionResult: extractionResult,
  });
}

async function rewrite(
  title: string,
  partialInfoListScored: (string | number)[][]
) {
  const rsp = await submit({
    type: "rewrite",
    title: title,
    infoListScored: partialInfoListScored,
  });
  return rsp.text;
}

export function getTotalSummaryCount(infoListLength: number) {
  return Math.floor(Math.log2(infoListLength));
}

export async function summarize(
  setLoadingState: (arg: string) => void,
  corpus: string,
  callback: (pageEntries: string[], error?: boolean) => void
) {
  try {
    setLoadingState("Extracting data...");
    const extractResult = await extract(corpus);

    setLoadingState("Ranking results...");
    const infoListScored = (await rank(extractResult)).info_list_scored;

    const summaryCount = getTotalSummaryCount(infoListScored.length);
    const sortedInfoListScored = infoListScored
      .map((e: (string | number)[]) => e) // TODO (pdakin): Cleaner way to deep copy?
      .sort((l: (string | number)[], r: (string | number)[]) =>
        Number(l[1] < r[1])
      );

    // Summary at index zero is just the original text.
    let pageEntries = [corpus];
    setLoadingState("Writing summaries...");
    for (let i = 1; i < summaryCount; i++) {
      const numEntries = sortedInfoListScored.length / Math.pow(2, i);
      // TODO (pdakin): Resolve issue with concurrent requests when using streaming API.
      const text = await rewrite(
        extractResult.title,
        sortedInfoListScored
          .slice(0, numEntries)
          .map((entry: (string | number)[]) => entry[0])
      );
      pageEntries.push(text);
    }

    callback(pageEntries, false);
  } catch (error) {
    console.error(error);
    callback([], true);
  }
}
