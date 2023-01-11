import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { AreaService } from '../../services/http/area.service';
import { Component, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { EmpleadoService } from '../../services/http/empleado.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { MatIconRegistry } from '@angular/material/icon';
import { VirtualTimeScheduler } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  providers: [
    DatePipe
  ]
})

export class RegistroComponent {
  edadC: number | any;
  uuid: string | null
  activo = '';
  cargando = false;
  sex = '';
  edadM = '';
  isChecked: boolean = false;
  listaAreas: any[] = []
  form = this.fb.group({
    uuid: [''],
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    paterno: ['', [Validators.required, Validators.minLength(3)]],
    materno: ['', [Validators.minLength(3)]],
    fechaNacimiento: ['', [Validators.required]],
    sexo: ['', [Validators.required]],
    areas: ['', [Validators.required]],
    telefono: ['', [Validators.required, Validators.pattern(/^\d{10}?$/)]],
    correo: ['', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
    calle: ['', [Validators.required, Validators.minLength(3)]],
    exterior: ['', [Validators.required]],
    interior: [''],
    cp: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
    colonia: ['', [Validators.required, Validators.minLength(3)]],
    tc: [false, [Validators.required]],
    curp: ['',[Validators.required, Validators.minLength(18)]],
    salario: [ '', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]]
  })
  constructor(
    private matIconRegistry: MatIconRegistry,
    private fb: UntypedFormBuilder,
    private areasSrv: AreaService,
    private empleadoSrv: EmpleadoService,
    private datePipe: DatePipe,
    private router: Router,
    private snackBar: MatSnackBar,
    private matRadioButton: MatRadioModule,
    private activatedRouter: ActivatedRoute,
  ) {
    this.uuid = this.activatedRouter.snapshot.paramMap.get('uuid');

    this.areasSrv.lista().subscribe((resp: any) => {
      if (!resp.success) {
        return;
      }
      this.listaAreas = resp.lista;
    }, () => {
      this.snackBar.open("Ocurrió un problema en el servicio, inténtelo más tarde.", "Cerrar", {
        horizontalPosition: 'end',
        verticalPosition: 'top',
        duration: 5000
      })
      Swal.fire({
        icon: 'error',
        title: 'Atención!',
        text: 'Ocurrió un problema en el servicio, inténtelo más tarde.'
      })
    })

    if (this.uuid) {
      this.cargando = true;
      this.empleadoSrv.informacion(this.uuid).subscribe((resp: any) => {
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
            areas: resp.informacion.areas.map((el: any) => {
              return el.uuid
            }),
            calle: resp.informacion.calle,
            exterior: resp.informacion.exterior,
            interior: resp.informacion.interior,
            cp: resp.informacion.cp,
            colonia: resp.informacion.colonia,
            curp: resp.informacion.curp,
            salario: resp.informacion.curp
          })

        }, 100);
      }, () => {
        this.cargando = false;
        this.snackBar.open("Ocurrió un problema en el servicio, inténtelo más tarde.", "Cerrar", {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 5000
        })
        Swal.fire({
          icon: 'error',
          title: 'Atención!',
          text: 'Ocurrió un problema en el servicio, inténtelo más tarde.'
        })
        this.router.navigateByUrl('/empleado/lista')
      })
    }
  }

  
  public edad(usrEdad: any){
    var hoy = Date.now();
    var ageV = new Date(usrEdad)
    var realEdad = ageV.getTime();
    const diferencia = Math.abs(hoy - realEdad);
    this.edadC = Math.floor((diferencia / (1000 * 3600 * 24))/365.25);
    return this.edadC
  }

  registro() {
     
    
    if (this.form.invalid) return;
    const data = this.form.value
    if (data.tc === false ) {
      console.log("No has aceptado T&C")
      Swal.fire({
        icon: 'error',
        title: 'Atención!',
        text: 'No has aceptado los terminos y condiciones'
      })
      return
    }
    this.cargando = true;

    let solicitud = this.empleadoSrv.registrar(
      data.nombre as any, data.paterno as any, data.materno as any,
      data.sexo == 'true', this.datePipe.transform(data.fechaNacimiento, 'MM/dd/yyyy')!,
      data.calle as any, data.exterior as any, data.interior as any, data.cp as any, data.colonia as any,
      data.telefono as any, data.correo as any, data.areas as any, data.curp as any, data.salario as any
    )

    if (this.uuid) {

      solicitud = this.empleadoSrv.modificar(
        this.uuid,
        data.nombre as any, data.paterno as any, data.materno as any,
        data.sexo == 'true', this.datePipe.transform(data.fechaNacimiento, 'MM/dd/yyyy')!,
        data.calle as any, data.exterior as any, data.interior as any, data.cp as any, data.colonia as any,
        data.telefono as any, data.correo as any, data.areas as any, data.curp as any, data.salario as any
      )
    }

    solicitud.subscribe((resp: any) => {
      setTimeout(() => {
        this.cargando = false
        if (!resp.success) {
          Swal.fire({
            icon: 'error',
            title: 'Atención!',
            text: 'Ocurrió un problema en el servicio, inténtelo más tarde.'
          })
          this.snackBar.open("Ocurrió un problema en el servicio, inténtelo más tarde.", "Cerrar", {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            duration: 5000
          })
          return
        } else {
          Swal.fire({
            icon: 'success',
            title: '¡Gracias!',
            text: 'Te has registrado con éxito'
          })
        }

        const titulo = this.uuid ? 'Empleado actualizado' : 'Empleado registrado'
        this.snackBar.open(titulo, "Cerrar", {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 5000
        })
        this.router.navigateByUrl('/empleado/lista')
      }, 500);
    }, () => {
      this.cargando = false
      this.snackBar.open("Ocurrió un problema en el servicio, inténtelo más tarde.", "Cerrar", {
        horizontalPosition: 'end',
        verticalPosition: 'top',
        duration: 5000
      })
      Swal.fire({
        icon: 'error',
        title: 'Atención!',
        text: 'Ocurrió un problema en el servicio, inténtelo más tarde.'
      })
    })


    
  }

  imprimir(){
    console.log(this.form);

}
}

