import { Component, OnInit, Input } from '@angular/core';
import { Profile, SupabaseService } from '../supabase.service';
import { AuthSession } from '@supabase/supabase-js';
import { Location } from '@angular/common';
import { LoaderService } from '../loader.service';


@Component({
  selector: 'app-attack-list-component',
  templateUrl: './attack-list-component.component.html',
  styleUrls: ['./attack-list-component.component.css']
})
export class AttackListComponent implements OnInit {
  profile!: Profile;
  error: boolean = false;

  @Input()
  session!: AuthSession | null;

  constructor(private readonly supabase: SupabaseService, private location: Location, private loaderService: LoaderService) {
    this.session = this.supabase._session;
  }

  async ngOnInit(): Promise<void> {
    await this.getProfile();
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
