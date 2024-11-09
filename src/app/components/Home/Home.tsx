"use client";

import { ProductResult } from "../ProductAnswer/ProductResult";
import { Footer } from "../Footer/Footer";
import { Navbar } from "../Nav/Navbar";
import { SearchBar } from "../SearchBar/SearchBar";
import { ProductInfo } from "@/types/product";
import { KeyboardEvent, useRef, useState } from "react";
import { fetchData } from "@/utils/fetchData";

export interface ProductResultsType {
  text: string;
  title: string;
  image: string | null;
  price: number;
  tags?: string[];
  productUrl?: string;
}

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<ProductInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const matchCount = 5;

  /* --- RESULTS HANDLER --- */
  const handleResults = async () => {
    if (!query.trim()) {
      return; // Don't search if query is empty
    }

    setProducts([]);
    setLoading(true);

    try {
      const results: ProductInfo[] = await fetchData("/api/product-search", {
        query,
        matches: matchCount,
      });
      
      if (Array.isArray(results)) {
        setProducts(results);
        console.log("Products returned:", results);
      } else {
        console.error("Invalid response format");
        setProducts([]);
      }
    } catch (error) {
      console.error("Error during answer generation:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  /* --- KEY DOWN HANDLER --- */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleResults();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-1 overflow-auto">
        <div className="mx-auto flex h-full w-full max-w-[750px] flex-col items-center px-3 pt-4 sm:pt-8">
          <SearchBar
            inputRef={inputRef}
            query={query}
            onQueryChange={setQuery}
            onSearch={handleResults}
            onKeyDown={handleKeyDown}
          />

          {loading ? (
            <div className="animate-pulse mt-2 h-4 bg-gray-300 rounded w-full"></div>
          ) : products.length > 0 ? (
            <div className="mt-6 w-full">
              {products.map((product, index) => (
                <ProductResult
                  key={product.id || `product-${index}`} // Use product.id if available, fallback to index
                  descriptionHtml={product.description}
                  title={product.title}
                  image={product.featured_image_url ?? ""}
                  price={product.price}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <Footer />
    </div>
  );
}