import { OpenAIStream } from "@/utils/openAIStream";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const config = {
  runtime: "edge",
};

// Handle POST request
export async function POST(req: Request): Promise<Response> {
  try {
    const { prompt } = (await req.json()) as { prompt: string; };

    // Pass the user's apiKey to OpenAIStream
    if (!OPENAI_API_KEY) {
      return new Response("Error processing request. No API key found.", { status: 500 });
    }
    const stream = await OpenAIStream(prompt, OPENAI_API_KEY);

    return new Response(stream, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error in product-answer route:", error);
    return new Response("Error processing request", { status: 500 });
  }
}
