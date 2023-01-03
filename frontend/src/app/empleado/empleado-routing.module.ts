import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { PaginadorComponent } from './paginador/paginador.component';
import { RegistroComponent } from './registro/registro.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'lista',
        component: PaginadorComponent
      },{
        path: 'registro',
        component: RegistroComponent
      },{
        path: ':uuid/actualizar',
        component: RegistroComponent
      },{
        path: '**', redirectTo: 'lista'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpleadoRoutingModule { }
