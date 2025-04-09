'use client'

import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";

interface DeleteOrganizerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const BorrarOrganizadorDialog = ({isOpen, onClose, onDelete}: DeleteOrganizerDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[300px]">
        <DialogHeader>
          <DialogTitle>¿Estás seguro de que deseas eliminar este organizador?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={onDelete}>Sí, eliminar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BorrarOrganizadorDialog;
