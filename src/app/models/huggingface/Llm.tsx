import { HfInference } from "@huggingface/inference";

// TODO (pdakin): Make sure API token is not leaked during product rollout.

const HF_ACCESS_TOKEN = "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";
const FINAL_SUMMARY_TOKEN_COUNT = 20;

function countTokens(input: string) {
  // TODO (pdakin): Would be better to use the Bart Tokenizer to get a more accurate count,
  // but let's just estimate for now. Might even be an API for this as well.
  return input.length / 5;
}

export function getTotalSummaryCount(corpus: string) {
  // TODO (pdakin): Take a bit closer look at this guy.
  return Math.floor(Math.log2(countTokens(corpus) / FINAL_SUMMARY_TOKEN_COUNT));
}

export async function summarize(
  corpus: string,
  callback: (
    infoListScored: (string | number)[][],
    pageEntries: string[]
  ) => void
) {
  const api = new HfInference(HF_ACCESS_TOKEN);
  const count = getTotalSummaryCount(corpus);

  let pageEntries = [corpus];
  let currentLength = countTokens(corpus) / 2;
  for (let i = 0; i < count; i++) {
    const minLength = Math.floor(currentLength * 0.85);
    const maxLength = Math.floor(currentLength * 1.15);
    const summarizationArgs = {
      model: "facebook/bart-large-cnn",
      inputs: corpus,
      parameters: {
        max_length: maxLength,
        min_length: minLength,
      },
    };
    console.log(summarizationArgs);
    const result = (await api.summarization(summarizationArgs)).summary_text;
    pageEntries.push(result);
    currentLength /= 2;
  }

  callback([], pageEntries);
}
