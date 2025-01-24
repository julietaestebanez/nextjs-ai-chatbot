import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Token no proporcionado' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];

        // Validar el token con una clave secreta
        if (token !== process.env.API_BEARER_TOKEN) {
            return NextResponse.json({ message: 'Token inválido' }, { status: 403 });
        }

        const { content } = await req.json();

        console.log("Documento recibido:", content);

        return NextResponse.json({ message: 'Documento guardado exitosamente', data: content }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: 'Error interno del servidor', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}