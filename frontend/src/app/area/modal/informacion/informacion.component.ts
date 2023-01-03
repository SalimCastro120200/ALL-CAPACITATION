import { Component, Inject, OnInit } from '@angular/core';

import { AreaService } from '../../../servicios/http/area.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.component.html',
  styleUrls: ['./informacion.component.css']
})
export class InformacionComponent implements OnInit {
  cargando = true;
  areaInformacion: any
  constructor(
    private snackBar: MatSnackBar,
    private areaSrv: AreaService,
    @Inject( MAT_DIALOG_DATA ) private area: any
  ) { }

  ngOnInit(): void {
    this.areaSrv.informacion( this.area.uuid ).subscribe( (resp:any) => {
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
        this.areaInformacion = resp.informacion;
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
