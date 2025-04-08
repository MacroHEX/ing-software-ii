'use client'

import {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Edit, Trash} from "lucide-react"; // Importamos los iconos

interface User {
  usuarioid: number;
  nombre: string;
  apellido: string;
  nombreusuario: string;
  correo: string;
  rolid: number;
}

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [newUser, setNewUser] = useState({
    nombre: '',
    apellido: '',
    nombreusuario: '',
    correo: '',
    password: '',
    rolid: 2, // Rol por defecto (usuario regular)
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token no encontrado. Por favor, inicia sesión.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUsers(data);
        } else {
          setError(data.error || 'Error al cargar los usuarios');
        }
      } catch (error) {
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers().then();
  }, []);

  const handleCreateUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token no encontrado. Por favor, inicia sesión.');
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (response.ok) {
        setUsers((prevUsers) => [...prevUsers, data]);
        setIsDialogOpen(false); // Cerrar el diálogo
      } else {
        setError(data.error || 'Error al crear el usuario');
      }
    } catch (error) {
      setError('Error de conexión');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Usuarios</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto">Nuevo Usuario</Button>
          </DialogTrigger>
          <DialogContent className="w-[500px]">
            {/* Aseguramos que se incluya un DialogTitle */}
            <DialogHeader>
              <DialogTitle>Crear nuevo usuario</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  type="text"
                  value={newUser.nombre}
                  onChange={(e) => setNewUser({...newUser, nombre: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  type="text"
                  value={newUser.apellido}
                  onChange={(e) => setNewUser({...newUser, apellido: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="nombreusuario">Nombre de usuario</Label>
                <Input
                  id="nombreusuario"
                  type="text"
                  value={newUser.nombreusuario}
                  onChange={(e) => setNewUser({...newUser, nombreusuario: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="correo">Correo</Label>
                <Input
                  id="correo"
                  type="email"
                  value={newUser.correo}
                  onChange={(e) => setNewUser({...newUser, correo: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="rolid">Rol</Label>
                <select
                  id="rolid"
                  value={newUser.rolid}
                  onChange={(e) => setNewUser({...newUser, rolid: parseInt(e.target.value)})}
                >
                  <option value={1}>Admin</option>
                  <option value={2}>Usuario</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateUser}>Crear Usuario</Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Apellido</TableHead>
              <TableHead>Nombre de Usuario</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center p-4">Cargando...</TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.usuarioid}>
                  <TableCell>{user.usuarioid}</TableCell>
                  <TableCell>{user.nombre}</TableCell>
                  <TableCell>{user.apellido}</TableCell>
                  <TableCell>{user.nombreusuario}</TableCell>
                  <TableCell>{user.correo}</TableCell>
                  <TableCell>{user.rolid === 1 ? 'Admin' : 'Usuario'}</TableCell>
                  <TableCell>
                    <Button variant="link" className="mr-2 cursor-pointer hover:text-neutral-500"
                            onClick={() => console.log('Editando usuario')}>
                      <Edit size={20}/>
                    </Button>
                    <Button variant="link" className="text-red-500 cursor-pointer hover:text-red-400"
                            onClick={() => console.log('Borrando usuario')}>
                      <Trash size={20}/>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserTable;