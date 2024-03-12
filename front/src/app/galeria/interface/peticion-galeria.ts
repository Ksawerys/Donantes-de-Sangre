import { Time } from "@angular/common";

export interface PeticionGaleria {
  id: number;
  nombre: string;
  descripcion: string;
  propietario: number;
  verificado: boolean;
  createdAt: Time
}
