-- 1. Habilitar la extensión vector (si no está habilitada):
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Crear la tabla "embeddings" con un campo de tipo vector
CREATE TABLE IF NOT EXISTS embeddings (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  embedding VECTOR(1536) NOT NULL
);