import { ProductInfo } from "./product";

export interface QueryIntent {
  type: 'specific' | 'general';
  confidence: number;
  cached?: boolean;
  categories?: string[];
}

export interface SearchOptions {
  query: string;
  page?: number;
  limit?: number;
}

export interface SearchResult {
  products: ProductInfo[];
  metadata: {
    queryIntent: QueryIntent;
    totalResults: number;
    searchType: 'specific' | 'diverse';
    categories?: string[];
  };
}