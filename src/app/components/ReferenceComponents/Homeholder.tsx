// app/components/Home.tsx
"use client"; // This directive makes this component a client component

import { ProductAnswer } from "../ProductAnswer/ProductAnswer";
import { Footer } from "../Footer/Footer";
import { Navbar } from "../Nav/Navbar";
import { ProductInfo } from "@/types/product";
import { Search, ArrowRight } from 'lucide-react';
import endent from "endent";
import { KeyboardEvent, useEffect, useRef, useState } from "react";

// Define ProductAnswer type for answer
export interface ProductAnswerType {
  text: string;
  title: string;
  image: string | null;
  price: number;
  tags?: string[];
  productUrl?: string;
}

// Main component
export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState<string>("");
  const [products, setProducts] = useState<ProductInfo[]>([]);
  const [answer, setAnswer] = useState<ProductAnswerType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [mode, setMode] = useState<"search" | "chat" | null>(null);
  const [matchCount, setMatchCount] = useState<number>(5);
  const [apiKey, setApiKey] = useState<string>("");

  // Handlers for product search and answer logic
  const handleSearch = async () => {
    if (!apiKey || !query) {
      alert(!apiKey ? "Please enter an API key." : "Please enter a query.");
      return;
    }
    
    setAnswer(null);
    setProducts([]);
    setLoading(true);

    try {
      console.log("Initiating search with query:", query);
      const searchResponse = await fetch("/api/product-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, apiKey, matches: matchCount }),
      });

      if (!searchResponse.ok) throw new Error(searchResponse.statusText);

      const results: ProductInfo[] = await searchResponse.json();
      console.log("Search results from API:", results);  // Log the received search results

      setProducts(results);
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async () => {
    if (!apiKey || !query) {
      alert(!apiKey ? "Please enter an API key." : "Please enter a query.");
      return;
    }
  
    setAnswer(null);
    setProducts([]);
    setLoading(true);
  
    try {
      console.log("Initiating answer generation with query:", query);
      const searchResponse = await fetch("/api/product-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, apiKey, matches: matchCount }),
      });
  
      if (!searchResponse.ok) throw new Error(searchResponse.statusText);
  
      const results: ProductInfo[] = await searchResponse.json();
      console.log("Answer search results:", results);
  
      setProducts(results);
  
      const prompt = endent`
        Use the following products to provide an answer to the query: "${query}"
        ${results.map((d) => d.description).join("\n\n")}
      `;
      console.log("Generated prompt for answer:", prompt);
  
      const answerResponse = await fetch("/api/product-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, apiKey }),
      });
  
      if (!answerResponse.ok) throw new Error(answerResponse.statusText);
  
      // Initialize variables to store the full JSON response
      const reader = answerResponse.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let fullResponse = "";
  
      while (!done) {
        const { value, done: doneReading } = await reader!.read();
        done = doneReading;
        fullResponse += decoder.decode(value);
      }
  
      // Clean any markdown formatting like backticks and trim whitespace
      const cleanedResponse = fullResponse.replace(/```json|```/g, "").trim();
  
      // Parse the JSON response safely
      const answerData = JSON.parse(cleanedResponse);
  
      console.log("Generated answer:", answerData);
      setAnswer(answerData); // Assuming answerData matches your ProductAnswerType format
    } catch (error) {
      console.error("Error during answer generation:", error);
    } finally {
      setLoading(false);
    }
  };
  
  

  // Handle pressing Enter in the search input
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") (mode === "search" ? handleSearch : handleAnswer)();
  };

  // Save settings to local storage
  const handleSave = () => {
    if (apiKey.length < 10) {
      alert("Please enter a valid API key.");
      return;
    }

    localStorage.setItem("MT_KEY", apiKey);
    localStorage.setItem("MT_MATCH_COUNT", matchCount.toString());
    if (mode) localStorage.setItem("MT_MODE", mode);
    setShowSettings(false);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    ["MT_KEY", "MT_MATCH_COUNT", "MT_MODE"].forEach(localStorage.removeItem);
    setApiKey("");
    setMatchCount(5);
    setMode("search");
  };

  // Restrict match count between 1 and 10
  useEffect(() => setMatchCount((count) => Math.min(10, Math.max(1, count))), [matchCount]);

  // Retrieve saved settings on mount
  useEffect(() => {
    setApiKey(localStorage.getItem("MT_KEY") || "");
    setMatchCount(parseInt(localStorage.getItem("MT_MATCH_COUNT") || "5"));
    inputRef.current?.focus();
    const savedMode = localStorage.getItem("MT_MODE") as "search" | "chat" | null;
    setMode(savedMode || "chat"); // default to "chat" if no saved mode
  }, []);

  // Update localStorage whenever mode changes
  useEffect(() => {
    if (mode) {
      localStorage.setItem("MT_MODE", mode);
    }
  }, [mode]);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-1 overflow-auto">
        <div className="mx-auto flex h-full w-full max-w-[750px] flex-col items-center px-3 pt-4 sm:pt-8">
          <button 
            className="mt-4 flex cursor-pointer items-center space-x-2 rounded-full border border-zinc-600 px-3 py-1 text-sm hover:opacity-50" 
            onClick={() => setShowSettings(!showSettings)}
          >
            {showSettings ? "Hide" : "Show"} Settings
          </button>

          {showSettings && (
            <div className="mt-4">
              <div>
                <label className="block">API Key:</label>
                <input 
                  type="text" 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)} 
                  className="border border-gray-300 rounded p-2"
                />
              </div>
              <button 
                onClick={handleSave} 
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button 
                onClick={handleClear} 
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
              >
                Clear
              </button>
            </div>
          )}

          {/* Main Search/Answer Input */}
          {apiKey.length > 10 ? (
            <div className="relative w-full mt-4">
              <Search className="absolute top-3 w-10 left-1 h-6 rounded-full opacity-50 sm:left-3 sm:top-4 sm:h-8" />
              <input 
                ref={inputRef} 
                className="h-12 w-full rounded-full border border-zinc-600 pr-12 pl-11 focus:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-800 sm:h-16 sm:py-2 sm:pr-16 sm:pl-16 sm:text-lg" 
                type="text" 
                placeholder="What are you looking for?" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                onKeyDown={handleKeyDown} 
              />
              <button>
                <ArrowRight 
                  onClick={mode === "search" ? handleSearch : handleAnswer} 
                  className="absolute right-2 top-2.5 h-7 w-7 rounded-full bg-blue-500 p-1 hover:cursor-pointer hover:bg-blue-600 sm:right-3 sm:top-3 sm:h-10 sm:w-10 text-white" 
                />
              </button>
            </div>
          ) : (
            <div className="text-center font-bold text-3xl mt-7">
              Please enter your
              <a className="mx-2 underline hover:opacity-50" href="https://platform.openai.com/account/api-keys">OpenAI API key</a> in settings.
            </div>
          )}

          {/* Display Answer and Products */}
          {loading ? (
            <div className="animate-pulse mt-2 h-4 bg-gray-300 rounded w-full"></div>
          ) : answer ? (
            <div className="mt-6">
              <ProductAnswer 
                text={answer.text} 
                title={answer.title} 
                image={answer.image ?? ""}  // Fallback to an empty string
                price={answer.price} 
              />
              <div className="mt-6">
                <img
                  src={answer.image || "/placeholder.jpg"}  // Placeholder if image is null
                  alt={answer.title}
                  className="w-full h-auto rounded-md"
                />
                <div className="font-bold text-2xl text-gray-800 mt-4">{answer.title}</div>
                <div className="mt-2 text-xl font-semibold">${(answer.price / 100).toFixed(2)}</div>
                <div className="text-gray-700 mt-2">{answer.text}</div>

                {/* Tags */}
                {answer.tags && answer.tags.length > 0 && (
                  <div className="mt-2 flex space-x-2">
                    {answer.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-200 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Buy Now Button */}
                {answer.productUrl && (
                  <a
                    href={answer.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Buy Now
                  </a>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <Footer />
    </div>
  );
}
