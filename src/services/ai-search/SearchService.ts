// import { LDClient, LDUser } from 'launchdarkly-node-client-sdk';
// import { QueryClassifier } from './QueryClassifier';
// import { SearchOptions, SearchResult } from '@/types/search';

// export class SearchService {
//   private classifier: QueryClassifier;
//   private ldClient: LDClient;

//   constructor(openAiKey: string, ldClient: LDClient) {
//     this.classifier = new QueryClassifier(openAiKey);
//     this.ldClient = ldClient;
//   }

//   async search(options: SearchOptions, user: LDUser): Promise<SearchResult> {
//     // Feature flags for different aspects of search
//     const flags = {
//       enableQueryClassification: await this.ldClient.variation('enable-query-classification', user, false),
//       enableDiverseSearch: await this.ldClient.variation('enable-diverse-search', user, false),
//       maxCategoryResults: await this.ldClient.variation('max-category-results', user, 5),
//       similarityThreshold: await this.ldClient.variation('similarity-threshold', user, 0.8),
//       enableAIRanking: await this.ldClient.variation('enable-ai-ranking', user, false),
//       searchStrategy: await this.ldClient.variation('search-strategy', user, 'default'),
//       // Experimentation flags
//       useNewEmbeddingModel: await this.ldClient.variation('use-new-embedding-model', user, false),
//       enableSearchAnalytics: await this.ldClient.variation('enable-search-analytics', user, false),
//       customRankingFactors: await this.ldClient.variation('custom-ranking-factors', user, [])
//     };

//     try {
//       // Only classify if feature is enabled
//       const queryIntent = flags.enableQueryClassification 
//         ? await this.classifier.classifyQuery(options.query)
//         : { type: 'specific', confidence: 1 };

//       let searchResult;
      
//       if (queryIntent.type === 'general' && flags.enableDiverseSearch) {
//         // Diverse search path with configurable parameters
//         searchResult = await this.performDiverseSearch(options, {
//           maxCategories: flags.maxCategoryResults,
//           similarityThreshold: flags.similarityThreshold,
//           rankingStrategy: flags.searchStrategy,
//           useNewModel: flags.useNewEmbeddingModel
//         });
//       } else {
//         // Specific search path with configurable parameters
//         searchResult = await this.performSpecificSearch(options, {
//           similarityThreshold: flags.similarityThreshold,
//           enableAIRanking: flags.enableAIRanking,
//           rankingFactors: flags.customRankingFactors
//         });
//       }

//       // Analytics tracking if enabled
//       if (flags.enableSearchAnalytics) {
//         await this.trackSearchMetrics(options, searchResult, flags);
//       }

//       return {
//         ...searchResult,
//         metadata: {
//           queryIntent,
//           searchType: queryIntent.type === 'general' ? 'diverse' : 'specific'
//         }
//       };
//     } catch (error) {
//       // Fallback strategy based on flags
//       const fallbackStrategy = await this.ldClient.variation('search-fallback-strategy', user, 'basic');
//       return this.handleSearchError(options, fallbackStrategy);
//     }
//   }

//   // Hook for components to use
//   public static useSearch() {
//     const [isSearching, setIsSearching] = useState(false);
//     const [error, setError] = useState<Error | null>(null);
//     const ldClient = useLDClient();

//     const performSearch = async (options: SearchOptions) => {
//       setIsSearching(true);
//       try {
//         const service = new SearchService(process.env.OPENAI_API_KEY!, ldClient);
//         const user = getUserContext(); // Get current user context
//         return await service.search(options, user);
//       } catch (err) {
//         setError(err instanceof Error ? err : new Error('Search failed'));
//         throw err;
//       } finally {
//         setIsSearching(false);
//       }
//     };

//     return { performSearch, isSearching, error };
//   }
// }