import { NextRequest, NextResponse } from 'next/server';
import { saveDocument, saveEmbedding } from '@/lib/db/queries';

export async function POST(req: NextRequest) {
  try {
    // 1) Verificar cabecera Authorization
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Token no proporcionado' }, { status: 401 });
    }

    // 2) Validar el token contra tu variable de entorno
    const token = authHeader.split(' ')[1];
    if (token !== process.env.API_BEARER_TOKEN) {
      return NextResponse.json({ message: 'Token inválido' }, { status: 403 });
    }

    // 3) Extraer datos del body
    //    Ajusta los campos (content, title, kind, userId, docId) según tu estructura real.
    const { content, title, kind, userId, docId } = await req.json();

    // 4) Guardar documento en la BD (Drizzle)
    await saveDocument({
      id: docId || 'doc-' + Date.now().toString(), // Generar un ID si no viene
      title: title || 'Untitled',
      kind: kind || BlockKind.Text,
      content,
      userId: userId || 'usuario-sistema', // Ajustar cómo identificas al "dueño"
    });

    // 5) Guardar embeddings (opcional, si tus requisitos lo piden)
    await saveEmbedding({ content });

    // 6) Responder con JSON de éxito
    return NextResponse.json({
      message: 'Documento y embeddings guardados exitosamente',
      data: { docId, title, userId }
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
