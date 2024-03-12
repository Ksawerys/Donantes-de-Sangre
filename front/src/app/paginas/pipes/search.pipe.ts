import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(lista:any[], nombre:string): any[] {
    if(!nombre)return lista;
    return lista.filter((l) => l.nombre.toLowerCase().includes(nombre.toLowerCase())); ;
  }

}
