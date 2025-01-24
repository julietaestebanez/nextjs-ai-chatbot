
// nextjs-ai-chatbot-main/lib/ai/embedding.ts

import { embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';

/**
 * Configura el modelo de OpenAI para embeddings.
 * El nombre text-embedding-ada-002 produce vectores de dimensión 1536.
 */
const embeddingModel = openai.embedding('text-embedding-ada-002');

/**
 * Recibe un string 'content' y retorna un vector (float[]) que
 * representa la "semántica" de ese texto.
 * 
 * @param {string} content - Texto para generar embedding
 * @return {Promise<number[]>} - Un array de 1536 números (vector float)
 */
export async function generateEmbeddings(content: string): Promise<number[]> {
  // embedMany permite procesar múltiples textos simultáneamente.
  // En este caso, solo usamos un array con 'content'.
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: [content], // Podrías pasar varios si deseas procesar lotes.
  });

  // 'embeddings' es un array de vectores. Para un solo texto, tomamos la posición [0].
  return embeddings[0];
}
