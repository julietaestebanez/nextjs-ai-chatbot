-- 1. Habilitar la extensión vector (si no está habilitada)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Crear la tabla "embeddings" con un campo de tipo vector(1536)
-- Usando UUID por defecto con gen_random_uuid() como PRIMARY KEY
CREATE TABLE IF NOT EXISTS embeddings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID,
  content TEXT NOT NULL,
  embedding VECTOR(1536) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);
