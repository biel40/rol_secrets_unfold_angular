import { Component, OnInit, Input } from '@angular/core';
import { Hability, Profile, SupabaseService } from '../supabase.service';
import { AuthSession, User } from '@supabase/supabase-js';
import { Location } from '@angular/common';
import { LoaderService } from '../loader.service';


@Component({
  selector: 'app-attack-list-component',
  templateUrl: './attack-list-component.component.html',
  styleUrls: ['./attack-list-component.component.css']
})
export class AttackListComponent implements OnInit {
  profile!: Profile;
  userHabilities!: Hability[];
  foundHabilities: boolean = false;

  error: boolean = false;

  @Input()
  session!: AuthSession | null;

  constructor(
    private readonly supabase: SupabaseService, 
    private location: Location, 
    private loaderService: LoaderService
  ) {
    this.session = this.supabase._session;
  }

  async ngOnInit(): Promise<void> {
    this.loaderService.setLoading(true);
    await this.getProfile();
    await this.getHabilitiesFromUser(this.profile);
  }

  async getProfile() {
    try {
      this.session = this.supabase._session;
      this.loaderService.setLoading(true);
    
      if (this.session) {
        const { user } = this.session;

        let { data: profile, error, status } = await this.supabase.profile(user);

        if (error && status !== 406) {
          throw error
        }

        if (profile) {
          this.profile = profile;
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      this.loaderService.setLoading(false);
    }
  }

  async getHabilities() {
    try {
      this.loaderService.setLoading(true);
      let habilities = await this.supabase.getAllHabilities();
      return habilities;
    } catch(error) {
      if (error instanceof Error){
        alert(error.message);
      }
      return error;
    } finally {
      this.loaderService.setLoading(false);
    }
  }

  getHabilitiesFromUser(profile: Profile) {
    try {
      this.loaderService.setLoading(true);
      let habilitiesFetched = this.supabase.getHabilitiesFromUser(profile);
      let habilities: Hability[] = [];
  
      habilitiesFetched.then( (habilitiesArray: any) => {
        habilitiesArray.forEach((hability: Hability) => {
          habilities.push(hability);
        });
        habilities.length > 0 ? this.foundHabilities = true : this.foundHabilities = false;
        this.userHabilities = habilities;
      }); 
    } catch(error) {
      if (error instanceof Error){
        alert(error.message);
      }
    } finally {
      this.loaderService.setLoading(false);
    }
  }

  goBack() {
    this.location.back();
  }

}
