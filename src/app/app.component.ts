import { Component, OnInit } from '@angular/core'
import { SupabaseService } from './supabase.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'angular-user-management'
  session: any;

  constructor(
    private readonly supabase: SupabaseService
  ) {

  }

  async ngOnInit() {
    await this.supabase.getSession().then((session) => {
      this.session = session;
    });
    
    this.supabase.authChanges((_, session) => (this.session = session));
  }
}