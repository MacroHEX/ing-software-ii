'use client'
import {useEffect, useState} from "react";

import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

import {IUsuario} from "@/interfaces/IUsuario";

interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (userData: any) => void;
  userData: IUsuario | null;
}

const EditarUsuarioDialog = ({isOpen, onClose, onUpdate, userData}: EditUserDialogProps) => {
  const [updatedUser, setUpdatedUser] = useState<IUsuario | null>(userData);

  useEffect(() => {
    if (userData) {
      setUpdatedUser(userData);
    }
  }, [userData]);

  if (!updatedUser) return null;

  const handleUpdateUser = () => {
    onUpdate(updatedUser);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar usuario</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              type="text"
              value={updatedUser?.nombre || ''}
              onChange={(e) => setUpdatedUser({...updatedUser!, nombre: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="apellido">Apellido</Label>
            <Input
              id="apellido"
              type="text"
              value={updatedUser?.apellido || ''}
              onChange={(e) => setUpdatedUser({...updatedUser!, apellido: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="nombreusuario">Nombre de Usuario</Label>
            <Input
              disabled
              id="nombreusuario"
              type="text"
              value={updatedUser?.nombreusuario || ''}
              onChange={(e) => setUpdatedUser({...updatedUser!, nombreusuario: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="correo">Correo</Label>
            <Input
              id="correo"
              type="email"
              value={updatedUser?.correo || ''}
              onChange={(e) => setUpdatedUser({...updatedUser!, correo: e.target.value})}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleUpdateUser}>Actualizar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditarUsuarioDialog;
