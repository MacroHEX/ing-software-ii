'use client'

import {useEffect, useState} from 'react';
import {Button} from '@/components/ui/button'; // Asegúrate de que el botón sea el de ShadCN
import {Card, CardContent, CardHeader} from '@/components/ui/card'; // Utilizamos el componente Card de ShadCN

export default function UserProfile() {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Obtener el token desde localStorage
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodificar el token JWT
      console.log(decodedToken)
      // Hacer una llamada API para obtener los datos del usuario (esto puede ser ajustado a tu endpoint)
      fetch(`/api/usuarios/${decodedToken.id}`)
        .then((response) => response.json())
        .then((data) => setUserData(data))
        .catch((error) => console.error('Error al obtener los datos del usuario', error));
    }
  }, []);

  if (!userData) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 gap-6">
      {/* Cuadro con los datos del usuario */}
      <Card className="w-full sm:w-96">
        <CardHeader>
          <h2 className="text-xl font-semibold">Perfil de Usuario</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Nombre:</span>
              <span>{userData.nombre} {userData.apellido}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Nombre de usuario:</span>
              <span>{userData.nombreusuario}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Correo:</span>
              <span>{userData.correo}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Rol:</span>
              <span>{userData.rolid === 1 ? 'Administrador' : 'Usuario'}</span>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => alert('Funcionalidad de edición próximamente')}
            >
              Editar Perfil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}