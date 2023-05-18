// TODO (pdakin): Hide your API key.
// TODO (pdakin): Do we need to be worried about prompt injection?
// TODO (pdakin): Prompt should NOT be visible to the user.
// TODO (pdakin): Use named types.

function constructExtractionPrompt(corpus: string) {
  return "";
}

function constructRankingPrompt(extractionResult: {
  title: string;
  infoList: string[];
}) {
  return "";
}

function extract(corpus: string) {
  const prompt = constructExtractionPrompt(corpus);
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

export async function summarize(
  corpus: string,
  callback: (infoListScored: (string | number)[][]) => void
) {
  const extractResult = extract(corpus);
  const rankResult = rank(extractResult);
  callback(rankResult.infoListScored);
}
