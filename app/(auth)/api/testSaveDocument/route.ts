import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const content = body.content || "Contenido de prueba por defecto";
        const metadata = { source: "API de prueba", generatedAt: new Date() };

        // Aquí deberías llamar a la función que guarda el contenido
        console.log("Recibido contenido:", content);

        return NextResponse.json({ message: 'Documento indexado exitosamente' }, { status: 200 });
    } catch (error: any) {
        console.error("Error al procesar la solicitud:", error);
        return NextResponse.json({ message: 'Error interno del servidor', error: error.message }, { status: 500 });
    }
}

// Manejar pre-flight requests para CORS
export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, x-vercel-protection-bypass",
        }
    });
}
