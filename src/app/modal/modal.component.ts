import { Component, Input, ViewEncapsulation, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-spinner',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ModalComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) 
    public data: any
  ) {
    
  }

}