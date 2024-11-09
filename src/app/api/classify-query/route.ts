import { NextResponse } from 'next/server';
import { QueryClassifier } from '@/services/ai-search/QueryClassifier';

const classifier = new QueryClassifier(process.env.OPENAI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    const intent = await classifier.classifyQuery(query);
    return NextResponse.json(intent);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to classify query' },
      { status: 500 }
    );
  }
}