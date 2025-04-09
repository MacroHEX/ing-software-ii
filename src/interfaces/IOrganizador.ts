import {IUsuario} from "@/interfaces/IUsuario";
import {IEvento} from "@/interfaces/IEvento";

export interface IOrganizador {
  organizadorid: number;
  usuarioid: number;
  eventoid: number;
  usuario: IUsuario;
  evento: IEvento;
}
