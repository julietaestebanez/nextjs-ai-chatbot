import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { email, password, content } = await req.json();

        // Validación básica de credenciales (puedes hacer una consulta a tu base de datos aquí)
        if (email !== process.env.AUTH_EMAIL || password !== process.env.AUTH_PASSWORD) {
            return NextResponse.json({ message: 'Credenciales incorrectas' }, { status: 401 });
        }

        console.log("Documento recibido:", content);

        return NextResponse.json({ message: 'Documento guardado exitosamente', data: content }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error interno del servidor', error: error.message }, { status: 500 });
    }
}
