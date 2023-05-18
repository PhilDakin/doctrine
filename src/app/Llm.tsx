// TODO (pdakin): Hide your API key.
// TODO (pdakin): Do we need to be worried about prompt injection?
// TODO (pdakin): Prompt should NOT be visible to the user - right now this is completely fucked
//                because of the client components theme issue.
// TODO (pdakin): Use named types.
// TODO (pdakin): API access will need to be asynchronous.

async function constructExtractionPrompt(corpus: string) {
  // TODO (pdakin): Sanitization.
  const response = await fetch(
    "/prompts?" + new URLSearchParams({ name: "extract" })
  );
  const json = await response.json();
  const promptBase = json.base;
  return `${promptBase}
Input:
{
    "text": ${corpus};
}
  `;
}

function constructRankingPrompt(extractionResult: {
  title: string;
  infoList: string[];
}) {
  return "";
}

function constructRewritePrompt(partialInfoListScored: (string | number)[][]) {
  return "";
}

async function extract(corpus: string) {
  const prompt = await constructExtractionPrompt(corpus);
  console.log(prompt);
  // TODO (pdakin): Use the LLM.
  return {
    title: "1996 Eurovision",
    infoList: [
      "The Eurovision Song Contest 1996 was the 41st edition of the Eurovision Song Contest.",
      "The contest was held on 18 May 1996 at the Oslo Spektrum in Oslo, Norway.",
      "The event was organised by the European Broadcasting Union (EBU) and host broadcaster Norsk rikskringkasting (NRK).",
      "Norwegian journalist and television presenter Ingvild Bryn and Norwegian singer Morten Harket presented the contest.",
      "The contest took place in Norway due to the country's victory at the 1995 contest with the song Nocturne by Secret Garden.",
      "Thirty countries submitted entries to the contest.",
      "A non-public, audio-only qualifying round was held two months before the final to reduce the number of participants from 30 to 23.",
      "The entries from Denmark, Germany, Hungary, Israel, Macedonia, Romania and Russia were eliminated in the qualifying round.",
      "As a result, Germany was absent from the contest for the first time.",
      "Ireland won the contest with the song The Voice, which was written by Brendan Graham and performed by Eimear Quinn.",
      "This victory extended Ireland's record to seven contest wins, including four wins in the last five years.",
      "Brendan Graham also recorded his second win as a songwriter in three years, having previously written the winning song at the 1994 contest.",
      "Norway, Sweden, Croatia and Estonia were the other top five countries.",
      "Croatia, Estonia and Portugal achieved their best results to date, with Portugal placing sixth.",
      "The 1996 contest was the final one where results were determined solely by jury voting.",
      "A trial use of televoting was introduced in the following year's event, leading to widespread adoption from 1998 onwards.",
    ],
  };
}

function rank(extractionResult: { title: string; infoList: string[] }) {
  const prompt = constructRankingPrompt(extractionResult);
  // TODO (pdakin): Use the LLM.
  return {
    infoListScored: [
      [
        "The Eurovision Song Contest 1996 was the 41st edition of the Eurovision Song Contest.",
        0.2,
      ],
      [
        "The contest was held on 18 May 1996 at the Oslo Spektrum in Oslo, Norway.",
        0.3,
      ],
      [
        "The event was organised by the European Broadcasting Union (EBU) and host broadcaster Norsk rikskringkasting (NRK).",
        0.2,
      ],
      [
        "Norwegian journalist and television presenter Ingvild Bryn and Norwegian singer Morten Harket presented the contest.",
        0.3,
      ],
      [
        "The contest took place in Norway due to the country's victory at the 1995 contest with the song Nocturne by Secret Garden.",
        0.6,
      ],
      ["Thirty countries submitted entries to the contest.", 0.3],
      [
        "A non-public, audio-only qualifying round was held two months before the final to reduce the number of participants from 30 to 23.",
        0.4,
      ],
      [
        "The entries from Denmark, Germany, Hungary, Israel, Macedonia, Romania and Russia were eliminated in the qualifying round.",
        0.5,
      ],
      [
        "As a result, Germany was absent from the contest for the first time.",
        0.6,
      ],
      [
        "Ireland won the contest with the song The Voice, which was written by Brendan Graham and performed by Eimear Quinn.",
        0.9,
      ],
      [
        "This victory extended Ireland's record to seven contest wins, including four wins in the last five years.",
        0.8,
      ],
      [
        "Brendan Graham also recorded his second win as a songwriter in three years, having previously written the winning song at the 1994 contest.",
        0.7,
      ],
      [
        "Norway, Sweden, Croatia and Estonia were the other top five countries.",
        0.5,
      ],
      [
        "Croatia, Estonia and Portugal achieved their best results to date, with Portugal placing sixth.",
        0.5,
      ],
      [
        "The 1996 contest was the final one where results were determined solely by jury voting.",
        0.7,
      ],
      [
        "A trial use of televoting was introduced in the following year's event, leading to widespread adoption from 1998 onwards.",
        0.7,
      ],
    ],
  };
}

function rewrite(partialInfoListScored: (string | number)[][]) {
  let prompt = constructRewritePrompt(partialInfoListScored);
  // TODO (pdakin): Use LLM.
  return (
    "Hey this is the result of a rewrite call " +
    String(partialInfoListScored.length)
  );
}

export function getTotalSummaryCount(infoListLength: number) {
  return Math.floor(Math.log2(infoListLength));
}

export async function summarize(
  corpus: string,
  callback: (
    infoListScored: (string | number)[][],
    pageEntries: string[]
  ) => void
) {
  // TODO (pdakin): It is really important this function is not called during a render cycle to avoid
  // some API loop bug. How do I assert this?

  const extractResult = await extract(corpus);
  const infoListScored = rank(extractResult).infoListScored;
  const summaryCount = getTotalSummaryCount(infoListScored.length);

  const sortedInfoListScored = infoListScored
    .map((e) => e) // TODO (pdakin): Cleaner way to deep copy?
    .sort((l: (string | number)[], r: (string | number)[]) =>
      Number(l[1] < r[1])
    );

  // Summary at index zero is just the original text.
  let pageEntries = [corpus];
  for (let i = 1; i < summaryCount; i++) {
    const numEntries = sortedInfoListScored.length / Math.pow(2, i);
    const text = rewrite(sortedInfoListScored.slice(0, numEntries));
    pageEntries.push(text);
  }

  // TODO (pdakin): Actually necessary to keep scored list in state?
  callback(infoListScored, pageEntries);
}
