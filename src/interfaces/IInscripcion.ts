export interface IInscripcion {
  inscripcionid: number;
  usuarioid: number;
  eventoid: number;
  fechainscripcion: Date;
  usuario: {
    nombreusuario: string;
  };
  evento: {
    nombre: string;
  };
}
