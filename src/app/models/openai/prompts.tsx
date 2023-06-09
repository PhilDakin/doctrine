export const EXTRACT_BASE = `
Input JSON with key "text".

Your job is to take text "text", extract all information conveyed by the text into a list of complete sentences, and provide a short title describing the content of the text.

Your output should be a JSON with a key "title" pointing to the string title and a key "info_list" pointing to a list of strings representing the result of your job.

Here are a few examples:

Input:
{
    "text": "The Eurovision Song Contest 1996 was the 41st edition of the Eurovision Song Contest, held on 18 May 1996 at the Oslo Spektrum in Oslo, Norway. Organised by the European Broadcasting Union (EBU) and host broadcaster Norsk rikskringkasting (NRK) and presented by Norwegian journalist and television presenter Ingvild Bryn and Norwegian singer Morten Harket, the contest was held in Norway following the country's victory at the 1995 contest with the song Nocturne by Secret Garden. Thirty countries submitted entries to the contest, with a non-public, audio-only qualifying round held two months before the final to reduce the number of participants from 30 to 23. The entries from Denmark, Germany, Hungary, Israel, Macedonia, Romania and Russia were subsequently eliminated, which resulted in Germany being absent from the contest for the first time. The winner was Ireland with the song The Voice, written by Brendan Graham and performed by Eimear Quinn. This gave the nation a record-extending seventh contest win, their fourth win in five years, with Graham also recording his second win as a songwriter in three years after having previously written the winning song at the 1994 contest. Norway, Sweden, Croatia and Estonia took the remaining places in the top five, with Croatia, Estonia and Portugal, which placed sixth, achieving the best results to date. This was the final contest where the results were determined solely by jury voting, with a trial use of televoting in the following year's event leading to widespread adoption from 1998 onwards."
}
Output:
{
"title": "1996 Eurovision",
"info_list": [
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
    "A trial use of televoting was introduced in the following year's event, leading to widespread adoption from 1998 onwards."
    ]
}

Input:
{
    "text": "Written studies of the Celts, their cultures, and their languages go back to classical Greek and Latin accounts, possibly beginning with Hecataeus in the 6th century BC[1] and best known through such authors as Polybius, Posidonius, Pausanias, Diodorus Siculus, Julius Caesar and Strabo. Modern Celtic studies originated in the 16th and 17th centuries, when many of these classical authors were rediscovered, published and translated.[1] Academic interest in Celtic languages grew out of comparative and historical linguistics, which was itself established at the end of the 18th century. In the 16th century, George Buchanan studied the Goidelic languages. The first major breakthrough in Celtic linguistics came with the publication of Archaeologia Britannica (1707) by the Welsh scholar Edward Lhuyd, who was the first to recognise that Gaulish, British and Irish belong to the same language family.[1] He also published an English version of a study by Paul-Yves Pezron of Gaulish. In 1767 James Parsons published his study The Remains of Japhet, being historical enquiries into the affinity and origins of the European languages. He compared a 1000-word lexicon of Irish and Welsh and concluded that they were originally the same, then comparing the numerals in many other languages."
}
Output:
{
"title": "Celtic Studies",
"info_list": [
    "Written studies of the Celts, their cultures, and their languages can be traced back to classical Greek and Latin accounts.",
    "The studies possibly began with Hecataeus in the 6th century BC.",
    "Well-known authors who studied the Celts include Polybius, Posidonius, Pausanias, Diodorus Siculus, Julius Caesar and Strabo.",
    "Modern Celtic studies originated in the 16th and 17th centuries, a period when many classical authors were rediscovered, published and translated.",
    "Academic interest in Celtic languages stemmed from comparative and historical linguistics, established at the end of the 18th century.",
    "In the 16th century, George Buchanan studied the Goidelic languages.",
    "A significant breakthrough in Celtic linguistics occurred with the publication of Archaeologia Britannica in 1707 by Welsh scholar Edward Lhuyd.",
    "Edward Lhuyd was the first to recognise that Gaulish, British and Irish belong to the same language family.",
    "Edward Lhuyd also published an English version of a study by Paul-Yves Pezron of Gaulish.",
    "In 1767, James Parsons published The Remains of Japhet, a historical enquiry into the affinity and origins of the European languages.",
    "James Parsons compared a 1000-word lexicon of Irish and Welsh and concluded that they were originally the same, and then he compared the numerals in many other languages."
    ]
}`;

export const RANK_BASE = `
Input JSON with key "title" and key "info_list".

Suppose you are interested in the input "title" value. For each element of the "info_list" provide a score from 0 to 1 indicating how interesting this piece of information is.

Your output should be a JSON with a "info_list_scored" pointing a list of (string, double) tuples representing the result of your job.

Here are a few examples:

Input:
{
"title": "1996 Eurovision",
"info_list": [
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
    "A trial use of televoting was introduced in the following year's event, leading to widespread adoption from 1998 onwards."
    ]
}
Output:
{
"info_list_scored": [
    ["The Eurovision Song Contest 1996 was the 41st edition of the Eurovision Song Contest.", 0.2],
    ["The contest was held on 18 May 1996 at the Oslo Spektrum in Oslo, Norway.", 0.3],
    ["The event was organised by the European Broadcasting Union (EBU) and host broadcaster Norsk rikskringkasting (NRK).", 0.2],
    ["Norwegian journalist and television presenter Ingvild Bryn and Norwegian singer Morten Harket presented the contest.", 0.3],
    ["The contest took place in Norway due to the country's victory at the 1995 contest with the song Nocturne by Secret Garden.", 0.6],
    ["Thirty countries submitted entries to the contest.", 0.3],
    ["A non-public, audio-only qualifying round was held two months before the final to reduce the number of participants from 30 to 23.", 0.4],
    ["The entries from Denmark, Germany, Hungary, Israel, Macedonia, Romania and Russia were eliminated in the qualifying round.", 0.5],
    ["As a result, Germany was absent from the contest for the first time.", 0.6],
    ["Ireland won the contest with the song The Voice, which was written by Brendan Graham and performed by Eimear Quinn.", 0.9],
    ["This victory extended Ireland's record to seven contest wins, including four wins in the last five years.", 0.8],
    ["Brendan Graham also recorded his second win as a songwriter in three years, having previously written the winning song at the 1994 contest.", 0.7],
    ["Norway, Sweden, Croatia and Estonia were the other top five countries.", 0.5],
    ["Croatia, Estonia and Portugal achieved their best results to date, with Portugal placing sixth.", 0.5],
    ["The 1996 contest was the final one where results were determined solely by jury voting.", 0.7],
    ["A trial use of televoting was introduced in the following year's event, leading to widespread adoption from 1998 onwards.", 0.7]
    ]
}

Input:
{
"title": "Celtic Studies",
"info_list": [
    "Written studies of the Celts, their cultures, and their languages can be traced back to classical Greek and Latin accounts.",
    "The studies possibly began with Hecataeus in the 6th century BC.",
    "Well-known authors who studied the Celts include Polybius, Posidonius, Pausanias, Diodorus Siculus, Julius Caesar and Strabo.",
    "Modern Celtic studies originated in the 16th and 17th centuries, a period when many classical authors were rediscovered, published and translated.",
    "Academic interest in Celtic languages stemmed from comparative and historical linguistics, established at the end of the 18th century.",
    "In the 16th century, George Buchanan studied the Goidelic languages.",
    "A significant breakthrough in Celtic linguistics occurred with the publication of Archaeologia Britannica in 1707 by Welsh scholar Edward Lhuyd.",
    "Edward Lhuyd was the first to recognise that Gaulish, British and Irish belong to the same language family.",
    "Edward Lhuyd also published an English version of a study by Paul-Yves Pezron of Gaulish.",
    "In 1767, James Parsons published The Remains of Japhet, a historical enquiry into the affinity and origins of the European languages.",
    "James Parsons compared a 1000-word lexicon of Irish and Welsh and concluded that they were originally the same, and then he compared the numerals in many other languages."
    ]
}
Output:
{
"info_list_scored": [
    ["Written studies of the Celts, their cultures, and their languages can be traced back to classical Greek and Latin accounts.", 0.5],
    ["The studies possibly began with Hecataeus in the 6th century BC.", 0.6],
    ["Well-known authors who studied the Celts include Polybius, Posidonius, Pausanias, Diodorus Siculus, Julius Caesar and Strabo.", 0.5],
    ["Modern Celtic studies originated in the 16th and 17th centuries, a period when many classical authors were rediscovered, published and translated.", 0.7],
    ["Academic interest in Celtic languages stemmed from comparative and historical linguistics, established at the end of the 18th century.", 0.8],
    ["In the 16th century, George Buchanan studied the Goidelic languages.", 0.6],
    ["A significant breakthrough in Celtic linguistics occurred with the publication of Archaeologia Britannica in 1707 by Welsh scholar Edward Lhuyd.", 0.9],
    ["Edward Lhuyd was the first to recognise that Gaulish, British and Irish belong to the same language family.", 0.9],
    ["Edward Lhuyd also published an English version of a study by Paul-Yves Pezron of Gaulish.", 0.6],
    ["In 1767, James Parsons published The Remains of Japhet, a historical enquiry into the affinity and origins of the European languages.", 0.7],
    ["James Parsons compared a 1000-word lexicon of Irish and Welsh and concluded that they were originally the same, and then he compared the numerals in many other languages.", 0.7]
    ]
}`;

export const REWRITE_BASE = `
Input JSON with keys "title" and "info_list".

Your job is to write a paragraph containing the information from "info_list" about the given "title". Your result should only use information from the "info_list".

Your output should be a JSON with a key "text" containing the result.

Input:
{
"title": "1996 Eurovision",
"info_list": [
    "The contest took place in Norway due to the country's victory at the 1995 contest with the song Nocturne by Secret Garden.",
    "As a result, Germany was absent from the contest for the first time.",
    "Ireland won the contest with the song The Voice, which was written by Brendan Graham and performed by Eimear Quinn.",
    "The 1996 contest was the final one where results were determined solely by jury voting."
    ]
}
Output:
{
"text": "The 1996 Eurovision Song Contest was hosted in Norway, following the country's victory in the 1995 contest with the song 'Nocturne' by Secret Garden. This year marked a unique absence of Germany, the first time this occurred in the history of the competition. Ireland emerged victorious at the contest with the song 'The Voice', a beautiful composition by Brendan Graham, rendered melodiously by Eimear Quinn. Notably, the 1996 Eurovision was the last year where results were solely determined by jury voting."
}

Input:
{
"title": "Celtic Studies",
"info_list": [
    "Well-known authors who studied the Celts include Polybius, Posidonius, Pausanias, Diodorus Siculus, Julius Caesar and Strabo.",
    "Modern Celtic studies originated in the 16th and 17th centuries, a period when many classical authors were rediscovered, published and translated.",
    "A significant breakthrough in Celtic linguistics occurred with the publication of Archaeologia Britannica in 1707 by Welsh scholar Edward Lhuyd.",
    "Edward Lhuyd was the first to recognise that Gaulish, British and Irish belong to the same language family.",
    "James Parsons compared a 1000-word lexicon of Irish and Welsh and concluded that they were originally the same, and then he compared the numerals in many other languages."
    ]
}
Output:
{
"text": "Celtic Studies, an academic discipline focusing on the study of the Celts, includes work from well-known authors such as Polybius, Posidonius, Pausanias, Diodorus Siculus, Julius Caesar, and Strabo. The modern form of Celtic studies finds its origins in the 16th and 17th centuries, a time marked by the rediscovery, publication, and translation of many classical authors. This field experienced a significant breakthrough in Celtic linguistics with the publication of 'Archaeologia Britannica' in 1707 by the Welsh scholar Edward Lhuyd. It was Lhuyd who first identified the Gaulish, British, and Irish languages as belonging to the same linguistic family. Further linguistic analysis was undertaken by James Parsons, who compared a 1000-word lexicon of Irish and Welsh, deducing that they shared a common origin. He also made comparisons of the numerals in many other languages."
}

Input:
{
"title": "1996 Eurovision",
"info_list": [
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
    "A trial use of televoting was introduced in the following year's event, leading to widespread adoption from 1998 onwards."
    ]
}
Output:
{
    "text": "The 41st edition of the Eurovision Song Contest took place on 18 May 1996 at the Oslo Spektrum in Oslo, Norway. This prestigious event was organized by the European Broadcasting Union (EBU) and host broadcaster Norsk rikskringkasting (NRK), and presented by Norwegian journalist Ingvild Bryn and singer Morten Harket. The contest was held in Norway due to its victory in the 1995 contest with the song 'Nocturne' by Secret Garden. Thirty countries submitted entries to the contest, but a non-public, audio-only qualifying round held two months prior reduced the number of participants to 23. As a result, seven countries, including Denmark, Germany, Hungary, Israel, Macedonia, Romania, and Russia were eliminated in the qualifying round, marking Germany's first absence in the contest's history. Ireland claimed the victory with 'The Voice', written by Brendan Graham and performed by Eimear Quinn. This win extended Ireland's record to seven contest wins, with four in the last five years. Brendan Graham achieved his second win as a songwriter in three years, following his previous success in 1994. Other top performers included Norway, Sweden, Croatia, and Estonia. Meanwhile, Croatia, Estonia, and Portugal achieved their best results to date, with Portugal placing sixth. The 1996 contest was the last one where results were determined solely by jury voting. Starting from the next year, a trial use of televoting was introduced, leading to its widespread adoption from 1998 onwards."
}`;

export function constructExtractionPrompt(corpus: string) {
  // TODO (pdakin): Consider sanitizing input.
  const promptBase = EXTRACT_BASE;
  return `${promptBase}
  Input:
  {
      "text": ${corpus};
  }`;
}

export function constructRankingPrompt(extractionResult: {
  title: string;
  infoList: string[];
}) {
  const promptBase = RANK_BASE;
  return `${promptBase}
  Input:
  ${JSON.stringify(extractionResult, null, 2)}`;
}

export function constructRewritePrompt(
  title: string,
  partialInfoListScored: (string | number)[][]
) {
  const promptBase = REWRITE_BASE;
  return `${promptBase}
  Input:
  ${JSON.stringify(
    { title: title, info_list: partialInfoListScored },
    null,
    2
  )}`;
}
