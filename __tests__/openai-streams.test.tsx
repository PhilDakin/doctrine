/**
 * @jest-environment node
 */

import { constructExtractionPrompt } from "@/app/models/openai/route";
import { OpenAI } from "openai-streams";
import { yieldStream } from "yield-stream";

it("openai-streams behaves as expected", async () => {
  const prompt = constructExtractionPrompt("");
  const stream = await OpenAI("chat", {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0,
  });

  let count = 0;
  for await (const chunk of yieldStream(stream)) {
    console.log(new TextDecoder().decode(chunk));
    count++;
  }
  expect(count).toBeGreaterThan(1);
}, 90000);
