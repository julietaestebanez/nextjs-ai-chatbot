import { embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import { db } from '@/lib/db';
import { embeddings } from '@/lib/db/schema';

const embeddingModel = openai.embedding('text-embedding-ada-002');

export const generateAndStoreEmbedding = async (content: string) => {
  const { embeddings: generatedEmbeddings } = await embedMany({
    model: embeddingModel,
    values: [content],
  });

  await db.insert(embeddings).values({
    content,
    embedding: generatedEmbeddings[0],
  });
};