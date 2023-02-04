import { Component, Input, OnInit } from '@angular/core';
import { Profile, SupabaseService } from '../supabase.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthSession } from '@supabase/supabase-js';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.css']
})
export class AccountEditComponent implements OnInit {

  url: String = '';
  loading = false;
  profile!: Profile;

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

  async updateProfile(): Promise<void> {
    try {
      this.loading = true
      const { user } = this.session

      const username = this.updateProfileForm.value.username as string
      const clase = this.updateProfileForm.value.clase as string
      const power = this.updateProfileForm.value.power as string
      const level = this.updateProfileForm.value.level as number
      const avatar_url = this.updateProfileForm.value.avatar_url as string

      const { error } = await this.supabase.updateProfile({
        id: user.id,
        username,
        clase, 
        power,
        level,
        avatar_url,
      })
      if (error) throw error
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      this.loading = false
    }
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

}
