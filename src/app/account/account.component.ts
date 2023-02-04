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

  constructor(private readonly supabase: SupabaseService, private formBuilder: FormBuilder, private router: Router) {}

  async ngOnInit(): Promise<void> {
    await this.getProfile()

    const { username, avatar_url, clase, power, level } = this.profile
    this.updateProfileForm.patchValue({
      username,
      clase,
      power,
      level,
      avatar_url,
    })
    
    this.url = this.router.url;
    console.log(this.url);
  }

  async getProfile() {
    try {
      this.loading = true
      const { user } = this.session
      let { data: profile, error, status } = await this.supabase.profile(user)

      if (error && status !== 406) {
        throw error
      }

      if (profile) {
        this.profile = profile
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      this.loading = false
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

  onOutletLoaded(component: AttackListComponent) {
    component.profile = this.profile;
  } 
}