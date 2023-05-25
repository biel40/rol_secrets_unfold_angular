import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  exports: [
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule
  ]
})

export class MaterialModule {}
