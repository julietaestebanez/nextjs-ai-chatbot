import NextAuth from 'next-auth';
import { authConfig } from '@/app/(auth)/auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    '/',
    '/:id',
    // Aplica el middleware a cualquier ruta en /api excepto /api/testsavedocument
    '/api/(?!testsavedocument).*',
    '/login',
    '/register',
  ],
};
