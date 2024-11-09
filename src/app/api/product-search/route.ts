// app/api/product-search/route.ts

import { supabaseAdmin } from '@/services/supabase/supabaseAdmin';
import fs from 'fs';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const config = {
  runtime: "edge",
};

// Handle POST request
export async function POST(req: Request): Promise<Response> {
  try {
    const { query, matches } = (await req.json()) as {
      query: string;
      matches: number;
    };

    console.log("Received API request with query:", query);
    const input = query.replace(/\n/g, " ");

    const res = await fetch("https://api.openai.com/v1/embeddings", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      method: "POST",
      body: JSON.stringify({
        model: "text-embedding-3-small", 
        input,
      }),
    });

    if (!res.ok) {
      const errorMessage = await res.text();
      console.error("OpenAI API error:", errorMessage);
      return new Response("Error generating embeddings", { status: 500 });
    }

    const json = await res.json();
    const embedding = json.data[0].embedding;
    fs.writeFile('embedding.json', JSON.stringify(embedding), (err) => {
      if (err) {
        console.error('Error writing embedding to file:', err);
      } else {
        console.log('Embedding saved to embedding.json');
      }
    });

    console.log("Calling Supabase RPC 'product_search' with embedding and params.");
    const { data: products, error } = await supabaseAdmin.rpc("product_search", {
      query_embedding: embedding,
      similarity_threshold: 0.7,
      match_count: matches,
    });

    if (error) {
      console.error("Supabase error:", error);
      return new Response("Error accessing product data", { status: 500 });
    }

    console.log("Supabase search results:", products);  // Log the results returned by Supabase
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("API handler error:", error);
    return new Response("Error processing request", { status: 500 });
  }
}
