import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from '@angular/material/card';

@NgModule({
  exports: [
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule
  ]
})

export class MaterialModule {}
