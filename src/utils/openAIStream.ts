import OpenAI from "openai";

export async function OpenAIStream(prompt: string, apiKey: string): Promise<ReadableStream> {
  const openai = new OpenAI({
    apiKey,
  });

  let stream;
  try {
    stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that provides structured product recommendations.
                    Respond strictly in JSON format with no code blocks or Markdown syntax, using this structure:

                    {
                      "title": "Product title",
                      "description": "Brief product description",
                      "price": "Product price in dollars as a number",
                      "tags": ["tag1", "tag2"],
                      "productUrl": "URL link to the product"
                    }

                    Do not include any additional text, code block markers, or formatting hints.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      stream: true,
      max_tokens: 400,
      temperature: 0.0,
    });
  } catch (error) {
    console.error("Error creating OpenAI stream:", error);
    throw new Error("Failed to create OpenAI completion stream.");
  }

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          let content = chunk.choices[0]?.delta?.content || "";

          // Remove "```json" and backticks if present, and trim whitespace
          content = content.replace(/```json|```/g, "").trim();

          controller.enqueue(content);
        }
      } catch (error) {
        console.error("Error reading from OpenAI stream:", error);
        controller.error(error);
      } finally {
        controller.close();
      }
    },
  });
}
