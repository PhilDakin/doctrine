async function extract(corpus: string) {
  return await (
    await fetch("/models/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "extract",
        corpus: corpus,
      }),
    })
  ).json();
}

async function rank(extractionResult: { title: string; infoList: string[] }) {
  return await (
    await fetch("/models/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "rank",
        extractionResult: extractionResult,
      }),
    })
  ).json();
}

async function rewrite(
  title: string,
  partialInfoListScored: (string | number)[][]
) {
  const rsp = await (
    await fetch("/models/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "rewrite",
        title: title,
        infoListScored: partialInfoListScored,
      }),
    })
  ).json();
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
    // TODO (pdakin): It is really important this function is not called during render cycle to avoid
    // some API loop bug. How do I assert this?

    setLoadingState("Extracting data...");
    const extractResult = await extract(corpus);
    if (!extractResult) {
      callback([], true);
      return;
    }

    setLoadingState("Ranking results...");
    const infoListScored = await rank(extractResult);
    if (!infoListScored) {
      callback([], true);
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
        callback([], true);
      }
    }

    // TODO (pdakin): Actually necessary to keep scored list in state?
    callback(pageEntries, false);
  } catch {
    callback([], true);
  }
}
