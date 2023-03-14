import { Component, Input, OnInit } from '@angular/core';
import { Profile, SupabaseService } from '../supabase.service';
import { FormBuilder } from '@angular/forms';
import { AuthSession } from '@supabase/supabase-js';
import { Location } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.css']
})
export class AccountEditComponent implements OnInit {

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  matcher = new ErrorStateMatcher();

  classList: string[] = ['Guerrero', 'Arquero', 'Mago', 'Sacerdote', 'Bárbaro', 'Pícaro', 'Monje']
  powerList: string[] = ['Pyro', 'Electro', 'Hydro', 'Aero', 'Geo', 'Natura'];
  levels: number[] = [0, 1, 2, 3, 4];

  loading = false;
  profile!: Profile;
  error: boolean = false;

  @Input()
  session!: AuthSession

  updateProfileForm = this.formBuilder.group({
    username: '',
    clase: '',
    power: '',
    level: 0
  })

  constructor(private readonly supabase: SupabaseService, private formBuilder: FormBuilder, private location: Location) {}

  async ngOnInit(): Promise<void> {

    await this.getProfile()

    if (this.profile) {
      const { username, clase, power, level } = this.profile

      this.updateProfileForm.patchValue({
        username,
        clase,
        power,
        level
      })
    }
    
  }

  async updateProfile(): Promise<void> {

    await this.getProfile()
    
    try {
      this.loading = true;

      console.log("Updating profile...");

      let user  = this.supabase._session?.user;

      const username = this.updateProfileForm.value.username as string;
      const clase = this.updateProfileForm.value.clase as string;
      const power = this.updateProfileForm.value.power as string;
      const level = this.updateProfileForm.value.level as number;
  
      if (user) {
        const { error } = await this.supabase.updateProfile({
          id: user.id,
          username,
          clase, 
          power,
          level
        }) 
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      this.loading = false;
      alert("Usuario actualizado correctamente!");
      this.goBack();
    }
  }

  async getProfile() {
    try {
      this.loading = true;

      if (this.session) {
        const { user } = this.session;
        let { data: profile, error, status } = await this.supabase.profile(user);

        if (error && status !== 406) {
          throw error
        }

        if (profile) {
          this.profile = profile
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      this.loading = false
    }
  }

  displayValidationModal(type: string) {
    console.log(type);
    if (type == "error") {
      this.error = true;
    }
  }

  goBack() {
    this.location.back();
  }

}
