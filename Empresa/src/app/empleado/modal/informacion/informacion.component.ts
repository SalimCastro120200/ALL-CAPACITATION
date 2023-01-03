import { Component, OnInit, Inject } from '@angular/core';

import { EmpleadoService } from '../../../services/http/empleado.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.component.html',
  styleUrls: ['./informacion.component.css']
})
export class InformacionComponent implements OnInit {
  cargando = false;
  empleadoInformacion: any;
  constructor(
    private empleadoSrv: EmpleadoService,
    private snackBar: MatSnackBar,
    @Inject( MAT_DIALOG_DATA ) private empleado: any
  ) { }

  ngOnInit(): void {
    this.cargando = true
    this.empleadoSrv.informacion( this.empleado.uuid ).subscribe( (resp:any) => {
      setTimeout(() => {
        this.cargando = false;
        if( !resp.success ) {
          this.snackBar.open( "Ocurrió un problema en el servicio, inténtelo más tarde.", "Cerrar", {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            duration: 5000
          } )
          return
        }
        this.empleadoInformacion = resp.informacion;
      }, 500);
    }, () => {
      this.snackBar.open( "Ocurrió un problema en el servicio, inténtelo más tarde.", "Cerrar", {
        horizontalPosition: 'end',
        verticalPosition: 'top',
        duration: 5000
      } )
      this.cargando = false;
    } )
  }

}
