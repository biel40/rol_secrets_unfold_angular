import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { AuthSession } from '@supabase/supabase-js'
import { Profile, SupabaseService } from '../supabase.service'
import { Router } from '@angular/router';
import { AttackListComponent } from '../attack-list/attack-list-component.component';
import { LoaderService } from '../loader.service';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {

  profile!: Profile;

  @Input()
  session!: AuthSession

  constructor (
    private readonly supabase: SupabaseService, 
    private router: Router,
    private loaderService: LoaderService
  ) {
    
  }

  async ngOnInit(): Promise<void> {
    await this.getProfile();
  }

  async getProfile() {

    this.loaderService.setLoading(true);

    try {

      const user  = this.supabase.session?.user;
      
      if (user) {
        let { data: profile, error, status } = await this.supabase.profile(user);

        if (error && status !== 406) {
          throw error
        }
  
        if (profile) {
          this.profile = profile
        }
      } 
    } catch (error) {
      alert(error)
    } finally {
      this.loaderService.setLoading(false);
    }
  }

  async signOut() {
    await this.supabase.signOut();
    this.goToIndex();
  }

  goToIndex() {
    this.router.navigate(['/']);
  }

  goToAttackList() {
    this.router.navigate(['/attackList']);
  }

  goToAccountEdit() {
    this.router.navigate(['/accountEdit']);
  }

  onOutletLoaded(component: AttackListComponent) {
    component.profile = this.profile;
  } 
}