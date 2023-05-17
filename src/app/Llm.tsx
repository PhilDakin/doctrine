import { Configuration, OpenAIApi } from "openai";

// TODO (pdakin): Hide your API key.
// TODO (pdakin): Do we need to be worried about prompt injection?
// TODO (pdakin): Prompt should NOT be visible to the user.

function constructPrompt(corpus: string) {
  // TODO (pdakin): Make this work
  let prompt = ``;
  return prompt;
}

export async function summarize(
  corpus: string,
  callback: (result: string) => void
) {
  const configuration = new Configuration({
    // apiKey: process.env.OPENAI_API_KEY,
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);
  openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: constructPrompt(corpus),
        },
      ],
      temperature: 0,
      max_tokens: 8,
      presence_penalty: -1.5,
    })
    .then((result) => {
      // TODO (pdakin): Handle bad responses.
      let response = result.data.choices[0];
      console.log(
        "Received OpenAI response with finish reason: ",
        response.finish_reason
      );
      if (!response.message) {
        console.log("Undefined message! This should never happen.");
        return;
      }
      callback(response.message.content);
    });
}
