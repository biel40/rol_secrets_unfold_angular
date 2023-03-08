import { Component, OnInit, Input } from '@angular/core';
import { Profile } from '../supabase.service';


@Component({
  selector: 'app-attack-list-component',
  templateUrl: './attack-list-component.component.html',
  styleUrls: ['./attack-list-component.component.css']
})
export class AttackListComponent implements OnInit {

  url = '';
  //TODO: Cómo puedo pasar estas props desde el Supabase hasta aquí?
  @Input()
  profile!: Profile;

  constructor() {
    
  }

  ngOnInit(): void {
    
  }


}
