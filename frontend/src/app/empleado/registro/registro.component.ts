import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { AreaService } from '../../servicios/http/area.service';
import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { EmpleadoService } from '../../servicios/http/empleado.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  providers: [
    DatePipe
  ]
})
export class RegistroComponent {
  uuid: string | null
  cargando = false;
  listaAreas : any[] = []
  form = this.fb.group({
    uuid           : [ '' ],
    nombre         : [ '', [ Validators.required, Validators.minLength(3) ] ],
    paterno        : [ '', [ Validators.required, Validators.minLength(3) ] ],
    materno        : [ '', [ Validators.minLength(3) ] ],
    fechaNacimiento: [ '', [ Validators.required ] ],
    sexo           : [ '', [ Validators.required ] ],
    areas          : [ '', [ Validators.required ] ],
    telefono       : [ '', [ Validators.required, Validators.pattern(/^\d{10}?$/) ] ],
    correo         : [ '', [ Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) ] ],
    calle   : [ '', [ Validators.required, Validators.minLength(3) ] ],
    exterior: [ '', [ Validators.required ] ],
    interior: [ '' ],
    cp      : [ '', [ Validators.required, Validators.pattern(/^[0-9]{5}$/) ] ],
    colonia : [ '', [ Validators.required, Validators.minLength(3) ] ]
  })
  constructor(
    private fb: FormBuilder,
    private areasSrv: AreaService,
    private empleadoSrv: EmpleadoService,
    private datePipe: DatePipe,
    private router: Router,
    private snackBar: MatSnackBar,
    private activatedRouter: ActivatedRoute
  ) {
    this.uuid = this.activatedRouter.snapshot.paramMap.get('uuid');

    this.areasSrv.lista().subscribe( (resp:any) => {
      if( !resp.success ) {
        return;
      }
      this.listaAreas = resp.lista;
    }, () => {
      this.snackBar.open( "Ocurri?? un problema en el servicio, int??ntelo m??s tarde.", "Cerrar", {
        horizontalPosition: 'end',
        verticalPosition: 'top',
        duration: 5000
      } )
    } )

    if( this.uuid ) {
      this.cargando = true;
      this.empleadoSrv.informacion( this.uuid ).subscribe( (resp:any) => {
        setTimeout(() => {
          this.cargando = false;
          this.form.patchValue({
            uuid: resp.informacion.uuid,
            nombre: resp.informacion.nombre,
            paterno: resp.informacion.paterno,
            materno: resp.informacion.materno,
            sexo: resp.informacion.sexo.toString(),
            correo: resp.informacion.correo,
            telefono: resp.informacion.telefono,
            fechaNacimiento: resp.informacion.fechaNacimiento,
            areas: resp.informacion.areas.map( (el:any) => {
              return el.uuid
            } ),
            calle: resp.informacion.calle,
            exterior: resp.informacion.exterior,
            interior: resp.informacion.interior,
            cp: resp.informacion.cp,
            colonia: resp.informacion.colonia
          })

        }, 100);
      }, () => {
        this.cargando = false;
        this.snackBar.open( "Ocurri?? un problema en el servicio, int??ntelo m??s tarde.", "Cerrar", {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 5000
        } )
        this.router.navigateByUrl('/empleado/lista')
      } )
    }
  }

  registro() {
    if( this.form.invalid ) return;
    this.cargando = true;
    const data = this.form.value

    let solicitud = this.empleadoSrv.registrar( 
      data.nombre, data.paterno, data.materno, 
      data.sexo, this.datePipe.transform( data.fechaNacimiento, 'MM/dd/yyyy' )!, 
      data.calle, data.exterior, data.interior, data.cp, data.colonia, 
      data.telefono, data.correo, data.areas
    )
    if( this.uuid ) {
      solicitud = this.empleadoSrv.modificar( 
        this.uuid,
        data.nombre, data.paterno, data.materno, 
        data.sexo, this.datePipe.transform( data.fechaNacimiento, 'MM/dd/yyyy' )!, 
        data.calle, data.exterior, data.interior, data.cp, data.colonia, 
        data.telefono, data.correo, data.areas
      )
    }

    solicitud.subscribe( (resp:any) => {
      setTimeout(() => {
        this.cargando = false
        if( !resp.success ) {
          this.snackBar.open( "Ocurri?? un problema en el servicio, int??ntelo m??s tarde.", "Cerrar", {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            duration: 5000
          } )
          return
        }
        const titulo = this.uuid ? 'Empleado actualizado' : 'Empleado registrado'
        this.snackBar.open( titulo, "Cerrar", {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 5000
        } )
        this.router.navigateByUrl('/empleado/lista')
      }, 500);
    }, () => {
      this.cargando = false
      this.snackBar.open( "Ocurri?? un problema en el servicio, int??ntelo m??s tarde.", "Cerrar", {
        horizontalPosition: 'end',
        verticalPosition: 'top',
        duration: 5000
      } )
    } )
  }
}
