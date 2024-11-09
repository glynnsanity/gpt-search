import OpenAI from "openai";
import { QueryIntent } from '@/types/search';

export class QueryClassifier {
  private cache: Map<string, { intent: QueryIntent; timestamp: number }>;
  private cacheDuration: number;
  private openai: OpenAI;

  constructor(apiKey: string, cacheDuration = 1000 * 60 * 60 * 24) {
    this.openai = new OpenAI({ apiKey });
    this.cache = new Map();
    this.cacheDuration = cacheDuration;
  }

  private normalizeQuery(query: string): string {
    return query.toLowerCase().trim();
  }

  private isCacheValid(timestamp: number): boolean {
    return (Date.now() - timestamp) < this.cacheDuration;
  }

  private async classifyWithGPT(query: string): Promise<QueryIntent> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a product search query classifier. Analyze if queries are specific or general.' },
          { role: 'user', content: query },
        ],
        tools: [{
          type: "function",
          function: {
            name: 'classifyQuery',
            description: 'Classify a product search query as specific or general',
            parameters: {
              type: "object",
              properties: {
                type: {
                  type: 'string',
                  enum: ['specific', 'general'],
                  description: 'Whether the query is specific or general',
                },
                confidence: {
                  type: 'number',
                  description: 'Confidence score between 0 and 1',
                },
                categories: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Potential product categories if query is general',
                },
              },
              required: ['type', 'confidence'],
              additionalProperties: false,
            },
          }
        }]
      });
      
      const toolCallArrayResponse = response.choices[0].message.tool_calls;
      // @ts-ignore
      const toolCall = toolCallArrayResponse[0];

      if (toolCall?.function?.arguments) {
        return JSON.parse(toolCall.function.arguments);
      }

      return this.fallbackClassification(query);
    } catch (error) {
      console.error('GPT classification failed:', error);
      return this.fallbackClassification(query);
    }
  }

  private fallbackClassification(query: string): QueryIntent {
    const words = query.split(' ').length;
    const hasSpecificModifiers = /^(specific|exact|particular|precise)/i.test(query);
    const hasBroadModifiers = /^(all|any|best|top)/i.test(query);
    const hasColorOrSize = /(black|white|small|large|medium|\d+)/i.test(query);
    
    // More specific heuristics for product queries
    if ((words >= 3 && hasColorOrSize) || hasSpecificModifiers) {
      return {
        type: 'specific',
        confidence: 0.7
      };
    }
    
    return {
      type: 'general',
      confidence: 0.6
    };
  }

  public async classifyQuery(query: string): Promise<QueryIntent> {
    const normalizedQuery = this.normalizeQuery(query);
    
    const cached = this.cache.get(normalizedQuery);
    if (cached && this.isCacheValid(cached.timestamp)) {
      return { ...cached.intent, cached: true };
    }

    const intent = await this.classifyWithGPT(normalizedQuery);
    
    this.cache.set(normalizedQuery, {
      intent,
      timestamp: Date.now()
    });

    return intent;
  }
}