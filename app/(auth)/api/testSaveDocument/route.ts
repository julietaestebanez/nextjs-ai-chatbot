import { NextRequest, NextResponse } from 'next/server';
import { saveEmbedding } from '@/lib/db/queries';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const content = body.content || "Contenido de prueba";
        const metadata = { source: "API de prueba", generatedAt: new Date() };

        await saveEmbedding({ content, metadata });

        return NextResponse.json({ message: 'Documento indexado exitosamente' }, { status: 200 });
    } catch (error: any) {
        console.error("Error al indexar documento:", error);
        return NextResponse.json({ message: 'Error interno del servidor', error: error.message }, { status: 500 });
    }
}
