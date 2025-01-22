// pages/api/testSaveDocument.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { saveEmbedding } from '@/lib/db/queries';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Puedes definir el contenido de prueba o recibirlo desde req.body
    const content = req.body.content || "Este es el contenido del documento de prueba para indexar.";

    // Opcional: agregar metadata adicional
    const metadata = { source: "API de prueba", generatedAt: new Date() };

    // Llamada a la función que genera y guarda el embedding
    await saveEmbedding({ content, metadata });

    res.status(200).json({ message: 'Documento indexado exitosamente' });
  } catch (error: any) {
    console.error("Error al indexar documento:", error);
    res.status(500).json({ message: error.message || "Error interno del servidor" });
  }
}
