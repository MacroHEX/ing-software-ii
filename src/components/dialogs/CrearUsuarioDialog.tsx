'use client'

import {useEffect, useState} from 'react';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {toast} from 'sonner';
import {IRoles} from "@/interfaces/IRoles";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

interface CreateUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (userData: any) => Promise<boolean>;
}

const CrearUsuarioDialog = ({isOpen, onClose, onCreate}: CreateUserDialogProps) => {
  const [newUser, setNewUser] = useState({
    nombre: '',
    apellido: '',
    nombreusuario: '',
    correo: '',
    password: '',
    rolid: 2,
  });

  const [roles, setRoles] = useState<IRoles[]>([]);

  useEffect(() => {
    setNewUser({
        nombre: '',
        apellido: '',
        nombreusuario: '',
        correo: '',
        password: '',
        rolid: 2,
      }
    )
  }, [isOpen]);

  useEffect(() => {
    // Obtener los roles desde la API
    const fetchRoles = async () => {
      try {
        const response = await fetch('/api/roles');
        if (!response.ok) {
          throw new Error('Error fetching roles');
        }
        const rolesData = await response.json();
        setRoles(rolesData);
      } catch (error) {
        toast.error('Error al obtener los roles');
      }
    };

    fetchRoles().then();
  }, []);

  const handleCreateUser = async () => {
    try {
      const success = await onCreate(newUser);
      if (success) {
        toast.success('Usuario creado con éxito');
        setNewUser({
          nombre: '',
          apellido: '',
          nombreusuario: '',
          correo: '',
          password: '',
          rolid: 2,
        });
        onClose();
      }
    } catch (error) {
      toast.error('Error al crear el usuario. Intenta nuevamente');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[500px]">
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
            <Select
              value={newUser.rolid.toString()}
              onValueChange={(value) => setNewUser({...newUser, rolid: parseInt(value)})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol"/>
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.rolid} value={role.rolid.toString()}>
                    {role.nombrerol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreateUser}>Crear Usuario</Button>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CrearUsuarioDialog;
