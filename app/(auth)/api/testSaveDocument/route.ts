import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { email, password, content } = await req.json();

        if (email !== process.env.AUTH_EMAIL || password !== process.env.AUTH_PASSWORD) {
            return NextResponse.json({ message: 'Credenciales incorrectas' }, { status: 401 });
        }

        console.log("Documento recibido:", content);

        return NextResponse.json({ message: 'Documento guardado exitosamente', data: content }, { status: 200 });
    } catch (error) {
        let errorMessage = 'Error interno del servidor';

        // Verificación segura del tipo de error
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }

        console.error("Error en la API:", errorMessage);

        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
