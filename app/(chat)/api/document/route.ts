// app/(chat)/api/document/route.ts

import { auth } from '@/app/(auth)/auth';
import { BlockKind } from '@/components/block';
import {
  deleteDocumentsByIdAfterTimestamp,
  getDocumentsById,
  saveDocument,
  saveEmbedding,
} from '@/lib/db/queries';
import { generateEmbeddings } from '@/lib/ai/embedding';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Missing id', { status: 400 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const documents = await getDocumentsById({ id });

  const [document] = documents;

  if (!document) {
    return new Response('Not Found', { status: 404 });
  }

  if (document.userId !== session.user.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  return Response.json(documents, { status: 200 });
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Missing id', { status: 400 });
  }

  // 1. Validar sesión
  const session = await auth();
  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  // 2. Extraer datos del body: content, title, kind
  const {
    content,
    title,
    kind,
  }: { content: string; title: string; kind: BlockKind } = await request.json();

  if (session.user?.id) {
    // 3. Guardar documento en tu tabla "Document"
    const document = await saveDocument({
      id,
      content,
      title,
      kind,
      userId: session.user.id,
    });

    // Generar y guardar embedding
    try {
      const embedding = await generateEmbeddings(content);
      if (!embedding) {
        throw new Error('No se pudo generar el embedding');
      }
      
      await saveEmbedding({
        id,
        content,
      });
      console.log(`Embedding generado y guardado exitosamente para documento ${id}`);
    } catch (error) {
      console.error('Error al procesar embedding:', error);
      console.error({
        documentId: id,
        contentLength: content.length,
        errorType: error.name,
        errorMessage: error.message
      });
    }

    return Response.json(document, { status: 200 });
  }

  return new Response('Unauthorized', { status: 401 });
}

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const { timestamp }: { timestamp: string } = await request.json();

  if (!id) {
    return new Response('Missing id', { status: 400 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const documents = await getDocumentsById({ id });
  const [document] = documents;

  if (document.userId !== session.user.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  await deleteDocumentsByIdAfterTimestamp({
    id,
    timestamp: new Date(timestamp),
  });

  return new Response('Deleted', { status: 200 });
}