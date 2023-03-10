import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { AuthSession } from '@supabase/supabase-js'
import { Profile, SupabaseService } from '../supabase.service'
import { Router } from '@angular/router';
import { AttackListComponent } from '../attack-list/attack-list-component.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {

  loading = false;
  showOverlay = false;
  profile!: Profile;
  url: String = '';

  @Input()
  session!: AuthSession

  updateProfileForm = this.formBuilder.group({
    username: '',
    clase: '',
    power: '',
    level: 0,
    avatar_url: '',
  })

  constructor (private readonly supabase: SupabaseService, private formBuilder: FormBuilder, private router: Router) {
    
  }

  async ngOnInit(): Promise<void> {

    this.displaySpinner();

    await this.getProfile();
  
    if (this.profile) {
      const { username, avatar_url, clase, power, level } = this.profile;

      this.updateProfileForm.patchValue({
        username,
        clase,
        power,
        level,
        avatar_url,
      })
    }
  }

  async getProfile() {
    try {
      this.loading = true

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
      this.loading = false
    }
  }

  displaySpinner() {

    this.showOverlay = true;

    setTimeout(() => {
      console.log("Muestras el overlay durante 2 segundos!")
      this.showOverlay = false;
    }, 1000);
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