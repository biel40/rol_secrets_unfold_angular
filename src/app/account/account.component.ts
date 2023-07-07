import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { AuthSession, User } from '@supabase/supabase-js'
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
  user: User | null = null;

  @Input()
  session!: AuthSession

  constructor(
    private readonly supabase: SupabaseService,
    private router: Router,
    private loaderService: LoaderService
  ) {
    this.getProfile();
  }

  async ngOnInit(): Promise<void> {
    await this.getProfile();
  }

  async getProfile() {

    this.loaderService.setLoading(true);

    try {
      const user = this.supabase.session?.user;

      if (user) {
        this.user = user;
        let { data: profile, error, status } = await this.supabase.profile(user);

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

  public activateLink(location: string): void {
    const link = location == 'profile' ? document.getElementById('open-update-profile') : document.getElementById('open-update-stats');
    if (link) {
      link.click();
    }
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

  goToStatsEdit() {
    this.router.navigate(['/statsEdit']);
  }

  goToCheckRolStats() {
    this.router.navigate(['/checkRolStats']);
  }

  onOutletLoaded(component: AttackListComponent) {
    component.profile = this.profile;
  }
}