import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AreaRoutingModule } from './area-routing.module';
import { CommonModule } from '@angular/common';
import { GestionComponent } from './modal/gestion/gestion.component';
import { InformacionComponent } from './modal/informacion/informacion.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { PaginadorComponent } from './paginador/paginador.component';

@NgModule({
  declarations: [
    PaginadorComponent,
    GestionComponent,
    InformacionComponent
  ],
  imports: [
    CommonModule,
    AreaRoutingModule,

    FormsModule,
    ReactiveFormsModule,

    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatDialogModule,
    MatListModule
  ]
})
export class AreaModule { }
