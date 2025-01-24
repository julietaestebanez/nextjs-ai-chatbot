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
    updateEmbedding = false,
  }: { content: string; title: string; kind: BlockKind; updateEmbedding?: boolean } = await request.json();

  if (session.user?.id) {
    // 3. Guardar documento en la tabla "Document"
    const document = await saveDocument({
      id,
      content,
      title,
      kind,
      userId: session.user.id,
    });

    // 4. Generar y guardar embedding (siempre que el contenido cambie)
    try {
      const embedding = await generateEmbeddings(content);
      if (!embedding) {
        throw new Error('No se pudo generar el embedding');
      }

      // Primero intentamos actualizar cualquier embedding existente
      const result = await db.execute(sql`
        UPDATE embeddings 
        SET content = ${content}, 
            embedding = ${`[${embedding.join(',')}]`}::vector,
            created_at = NOW()
        WHERE document_id = ${id}::uuid
      `);
      
      // Si no existe un embedding previo, creamos uno nuevo
      if (result.rowCount === 0) {

      await saveEmbedding({
        documentId: id, // Relaciona tu documento con este embedding
        content,
        embedding,
      });

      console.log(`Embedding generado y guardado exitosamente para documento ${id}`);
    } catch (error) {
      console.error('Error al procesar embedding:', error);
      console.error({
        documentId: id,
        contentLength: content.length,
        errorType: error instanceof Error ? error.name : 'Unknown Error',
        errorMessage: error instanceof Error ? error.message : String(error),
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
