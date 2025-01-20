CREATE TABLE IF NOT EXISTS "Embeddings" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "content" TEXT NOT NULL,
    "embedding" VECTOR(1536) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT now()
);