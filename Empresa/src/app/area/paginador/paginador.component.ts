import { Component, EventEmitter, ViewChild } from '@angular/core';
import { catchError, map, startWith, switchMap } from 'rxjs';
import { merge, of as observableOf } from 'rxjs';

import { AreaService } from '../../services/http/area.service';
import { GestionComponent } from '../modal/gestion/gestion.component';
import { IPaginador } from '../../_helpers/IPaginador';
import { InformacionComponent } from '../modal/informacion/informacion.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-paginador',
  templateUrl: './paginador.component.html',
  styleUrls: ['./paginador.component.css']
})
export class PaginadorComponent {
  
  listaAreas: any[] = []
  paginador: IPaginador = { 
    total: 0,
    encabezados: [ 'nombre', 'empleados', 'estatus', 'accion' ],
    buscar: "",
    max: 10
  }

  buscar = new EventEmitter<string>();
  estaCargando = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(
    private areaSrv: AreaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.buscar.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page, this.buscar)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.estaCargando = true;
          return this.areaSrv.paginar(
            this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginador.buscar
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(resp => {
          this.estaCargando = false;
          if( !resp.success ){
            this.snackBar.open( "Ocurrió un problema en el servicio, inténtelo más tarde.", "Cerrar", {
              horizontalPosition: 'end',
              verticalPosition: 'top',
              duration: 5000
            } )
            return []
          }
          this.paginador.total = resp.total;
          if( resp.total == 0 ) return [];
          return resp.lista;
        }),
      )
      .subscribe(lista => (this.listaAreas = lista));
  }

  timeout: any;
  buscarTabla( event: any ) : void {
    clearTimeout( this.timeout );
    this.timeout = setTimeout( () => {
      this.paginador.buscar = event.target.value;
      this.buscar.emit( event.target.value );
      clearTimeout( this.timeout );
    }, 500 );
  }

  gestionar( nombre?: string, uuid?: string ) {
    const dialog = this.dialog.open( GestionComponent, {
      data: {
        nombre, uuid
      },
      width: '25%',
      disableClose: true
    } )
    dialog.afterClosed().subscribe( (guardado?: boolean) => {
      if( guardado ) this.buscar.emit('')
    } )
  }

  actualizarEstatus( uuid: string, estatus: number ) {
    this.estaCargando = true;
    this.areaSrv.actualizarEstatus( uuid, estatus ).subscribe( (resp:any) => {
      this.estaCargando = false;
      if( !resp.success ) {
        this.snackBar.open( "Ocurrió un problema en el servicio, inténtelo más tarde.", "Cerrar", {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 5000
        } )
        return
      }

      let mensaje = "El área se ha activado correctamente"
      if( estatus == 2 ) mensaje = "El área se ha desactivado correctamente"
      if( estatus == 3 ) mensaje = "El área se ha eliminado correctamente"
      this.snackBar.open( mensaje, "Cerrar", {
        horizontalPosition: 'end',
        verticalPosition: 'top',
        duration: 5000
      } )
      this.buscar.emit('')
    }, () => {
      this.snackBar.open( "Ocurrió un problema en el servicio, inténtelo más tarde.", "Cerrar", {
        horizontalPosition: 'end',
        verticalPosition: 'top',
        duration: 5000
      } )
      this.estaCargando = false;
    } )
  }

  informacion( uuid: string ) {
    this.dialog.open( InformacionComponent, {
      data: {
        uuid
      },
      width: '50%'
    } )
  }
}