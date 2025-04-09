export interface IEvento {
  eventoid: number;
  nombre: string;
  fecha: Date;
  ubicacion: string;
  imagen: string;
  tipoeventoid: number;
  tipoevento: {
    descripcion: string;
  };
}
