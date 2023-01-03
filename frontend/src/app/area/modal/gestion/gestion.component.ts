import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { AreaService } from '../../../servicios/http/area.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.css']
})
export class GestionComponent implements OnInit {
  cargando : boolean = false;
  titulo = "Registro de área"
  form = this.fb.group({
    uuid: [ '' ],
    nombre: [ '', [ Validators.required, Validators.minLength(3) ] ]
  })
  constructor(
    private fb: FormBuilder,
    private areaSrv: AreaService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<GestionComponent>,
    @Inject( MAT_DIALOG_DATA ) private area: any
  ) { }

  ngOnInit(): void {
    if( this.area.uuid ) {
      this.titulo = "Actualización de área"
      this.form.patchValue({
        uuid: this.area.uuid,
        nombre: this.area.nombre
      })
    }
  }

  registro() {
    if( this.form.invalid ) return
    this.cargando = true;
    let solicitud = (this.form.value.uuid) ? this.areaSrv.modificar( this.form.value.uuid, this.form.value.nombre ) : this.areaSrv.registrar( this.form.value.nombre )
    solicitud.subscribe( (resp: any) => {
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
        
        let titulo = ( this.form.value.uuid ) ? 'Área actualizada' : 'Área registrada'
        this.snackBar.open( titulo, "Cerrar", {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 5000
        } )
        this.dialogRef.close( true );
      }, 1000);
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
