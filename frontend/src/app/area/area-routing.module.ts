import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { PaginadorComponent } from './paginador/paginador.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'lista',
        component: PaginadorComponent
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
export class AreaRoutingModule { }
