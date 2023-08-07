import { Component, Input, OnInit } from '@angular/core';
import { Profile, SupabaseService } from '../supabase.service';
import { FormBuilder } from '@angular/forms';
import { AuthSession } from '@supabase/supabase-js';
import { Location } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { LoaderService } from '../loader.service';

@Component({
  selector: 'app-stats-edit',
  templateUrl: './stats-edit.component.html',
  styleUrls: ['./stats-edit.component.css']
})
export class StatsEditComponent implements OnInit {

  profile!: Profile;

  emailFormControl = new FormControl('', [Validators.required]);
  matcher = new ErrorStateMatcher();

  error: boolean = false;

  @Input()
  session!: AuthSession | null;

  updateStatsForm = this.formBuilder.group({
    current_hp: 0,
    attack: 0,
    defense: 0,
    special_attack: 0,
    special_defense: 0,
    speed: 0, 
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

   await this.supabase.getSession().then((session) => {
      this.session = session;
    });

    await this.getProfile();

    if (this.profile) {
      const { current_hp, attack, defense, special_attack, special_defense, speed } = this.profile;

      this.updateStatsForm.patchValue({
        current_hp,
        attack,
        defense,
        special_attack,
        special_defense,
        speed
      });
    }
    
  }

  async updateStats(): Promise<void> {

    await this.getProfile()
    
    try {
      this.loaderService.setLoading(true);

      let user = this.session?.user;

      const current_hp = this.updateStatsForm.value.current_hp as number;
      const attack = this.updateStatsForm.value.attack as number;
      const defense = this.updateStatsForm.value.defense as number;
      const special_attack = this.updateStatsForm.value.special_attack as number;
      const special_defense = this.updateStatsForm.value.special_defense as number;
      const speed = this.updateStatsForm.value.speed as number;

      if (user) {
        this.supabase.updateProfile({
          id: user.id,
          clase: this.profile.clase,
          power: this.profile.power,
          level: this.profile.level,
          weapon: this.profile.weapon,
          current_hp,
          attack,
          defense,
          special_attack,
          special_defense,
          speed
        });
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
