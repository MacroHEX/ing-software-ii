import {NextResponse} from 'next/server';
import jwt from 'jsonwebtoken';
import {toast} from 'sonner';

// Función para verificar el token JWT y el rol
const authenticateAndAuthorize = (req: Request) => {
  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return {error: 'Token no proporcionado', status: 401};
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { rol: number };
    if (decoded.rol !== 1) { // Verifica si es administrador
      return {error: 'No tienes permiso para acceder a esta ruta', status: 403};
    }
    return {decoded};
  } catch (error) {
    return {error: 'Token inválido o expirado', status: 401};
  }
};

// Middleware para todas las peticiones
export async function middleware(req: Request) {
  const {error, status} = authenticateAndAuthorize(req);

  if (error) {
    // Mostrar el mensaje de error utilizando Sonner
    toast.error('Token inválido o expirado. Por favor, inicie sesión nuevamente.');

    // Redirigir al usuario a la página de inicio
    return NextResponse.redirect(new URL('/', req.url));  }

  return NextResponse.next(); // Permite continuar si es válido
}

// Configuración para las rutas a las que se aplicará el middleware
export const config = {
  matcher: ['/api/users/((?!general).*)', '/api/auth/((?!general).*)'],
};