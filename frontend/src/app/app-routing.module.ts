import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'area',
    loadChildren: () => import('./area/area.module').then( m => m.AreaModule )
  },
  {
    path: 'empleado',
    loadChildren: () => import('./empleado/empleado.module').then( m => m.EmpleadoModule )
  },{
    path: '**', redirectTo: 'area'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
