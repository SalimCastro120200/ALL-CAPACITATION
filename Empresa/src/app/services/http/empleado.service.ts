import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from './request.service';
import { SortDirection } from '@angular/material/sort';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  constructor(
    private req: RequestService
  ) { }

  paginar(sort: string, order: SortDirection, page: number, search: string = "") : Observable<any> {
    page++
    return this.req.get( environment.http.empleado.paginar, `?sort=${sort}&order=${order}&page=${page}&search=${search}` )
  }

  registrar( nombre: string, paterno: string, materno: string = '', sexo: boolean, fechaNacimiento: string, calle: string, exterior: string, interior: string = '', cp: string, colonia: string, telefono: string, correo: string, areas: string[] ) : Observable<any> {
    return this.req.post( environment.http.empleado.registro, {
      nombre, paterno, materno, sexo, fechaNacimiento, calle, exterior, interior, cp, colonia, telefono, correo, areas
    } )
  }

  modificar( uuid: string, nombre: string, paterno: string, materno: string = '', sexo: boolean, fechaNacimiento: string, calle: string, exterior: string, interior: string = '', cp: string, colonia: string, telefono: string, correo: string, areas: string[] ) : Observable<any> {
    return this.req.put( environment.http.empleado.modificar.replace("#uuid#", uuid), {
      nombre, paterno, materno, sexo, fechaNacimiento, calle, exterior, interior, cp, colonia, telefono, correo, areas
    } )
  }

  actualizarEstatus( uuid: string, estatus: number ) : Observable<any> {
    return this.req.patch( environment.http.empleado.actualizarEstatus.replace("#uuid#", uuid), `?estatus=${estatus}` )
  }

  informacion( uuid: string ) : Observable<any> {
    return this.req.get( environment.http.empleado.informacion.replace("#uuid#", uuid) )
  }
}
