import NextAuth from 'next-auth';
import { authConfig } from '@/app/(auth)/auth.config';

export default NextAuth(authConfig).auth;

// Configuración de rutas protegidas por autenticación, excluyendo testSaveDocument
export const config = {
  matcher: [
    '/', 
    '/:id', 
    '/login', 
    '/register', 
    '/api/:path*',
  ],
  missing: [
    { type: 'header', key: 'x-vercel-protection-bypass', value: '04863882959239923522127673998536' },
    { type: 'header', key: 'x-api-key', value: process.env.API_KEY }
  ]
};
