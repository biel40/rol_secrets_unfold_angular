import { Component, Input, OnInit } from '@angular/core';
import { Profile, SupabaseService } from '../supabase.service';
import { FormBuilder } from '@angular/forms';
import { AuthSession } from '@supabase/supabase-js';
import { Location } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { LoaderService } from '../loader.service';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.css']
})
export class AccountEditComponent implements OnInit {

  profile!: Profile;

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  matcher = new ErrorStateMatcher();

  classList: string[] = ['Guerrero', 'Arquero', 'Mago', 'Sacerdote', 'Bárbaro', 'Pícaro', 'Monje']
  powerList: string[] = ['Pyro', 'Electro', 'Hydro', 'Aero', 'Geo', 'Natura'];
  weaponList: string[] = ['Espada', 'Mandoble', 'Arco', 'Daga', 'Libro de hechizos'];
  levels: number[] = [0, 1, 2, 3, 4];

  error: boolean = false;

  @Input()
  session!: AuthSession | null;

  updateProfileForm = this.formBuilder.group({
    username: '',
    clase: '',
    power: '',
    level: 0,
    weapon: ''
  })

  constructor(
    private readonly supabase: SupabaseService, 
    private formBuilder: FormBuilder, 
    private location: Location,
    private loaderService: LoaderService
  ) {
    this.getProfile()
  }

  async ngOnInit(): Promise<void> {

    this.session = this.supabase.session;

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
      this.loaderService.setLoading(true);

      console.log("Updating profile......");

      let user  = this.session?.user;

      const username = this.updateProfileForm.value.username as string;
      const clase = this.updateProfileForm.value.clase as string;
      const power = this.updateProfileForm.value.power as string;
      const level = this.updateProfileForm.value.level as number;
      const weapon = this.updateProfileForm.value.weapon as string;

      if (user) {
        this.supabase.updateProfile({
          id: user.id,
          username,
          clase, 
          power,
          level,
          weapon
        }) 
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      this.loaderService.setLoading(false);
      alert("Usuario actualizado correctamente!");
      this.goBack();
    }
  }

  async getProfile() {
    try {
      this.loaderService.setLoading(true);

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
      this.loaderService.setLoading(false);
    }
  }

  goBack() {
    this.location.back();
  }

}
