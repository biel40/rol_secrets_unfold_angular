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
  calculatedProfile!: Profile;

  user: User | null = null;

  @Input()
  session!: AuthSession

  constructor(
    private readonly supabase: SupabaseService,
    private router: Router,
    private loaderService: LoaderService
  ) {

  }

  async ngOnInit(): Promise<void> {
    await this.getProfile();
    await this.calculateProfile();
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
    this.router.navigate(['/attackList'], { state: { calculatedProfile: this.calculatedProfile} });
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

  private calculateProfile() {
    if (this.profile) {
      const calculatedProfile: any = {
        ...this.profile,
        total_hp: this.profile.total_hp ? this.profile.total_hp * this.profile.level : 0,
        attack: this.profile.attack ? this.profile.attack * this.profile.level : 0,
        defense: this.profile.defense ? this.profile.defense * this.profile.level : 0,
        special_attack: this.profile.special_attack ? this.profile.special_attack * this.profile.level : 0,
        special_defense: this.profile.special_defense ? this.profile.special_defense * this.profile.level : 0,
        speed: this.profile.speed ? this.profile.speed * this.profile.level : 0,
      };
  
      switch (this.profile.clase) {
        case 'Guerrero':
          calculatedProfile.total_hp += 2 * this.profile.level;
          calculatedProfile.current_hp += 2 * this.profile.level;
          calculatedProfile.attack += 2 * this.profile.level;
          calculatedProfile.defense += 2 * this.profile.level;
          break;
        case 'Mago':
          calculatedProfile.special_attack += 2 * this.profile.level;
          calculatedProfile.special_defense += 2 * this.profile.level;
          break;
        case 'Arquero':
          calculatedProfile.special_attack += 2 * this.profile.level;
          calculatedProfile.speed += 2 * this.profile.level;
          break;
        case 'Sacerdote':
          // No additional calculations for Sacerdote class. It heals more than the others.
          break;
        case 'Bárbaro':
          calculatedProfile.attack += 2 * this.profile.level;
          calculatedProfile.defense += 2 * this.profile.level;
          break;
        case 'Pícaro':
          calculatedProfile.speed += 2 * this.profile.level;
          break;
        case 'Monje':
          calculatedProfile.attack += 1 * this.profile.level;
          calculatedProfile.speed += 2 * this.profile.level;
          break;
        default:
          break;
      }
  
      this.calculatedProfile = calculatedProfile;
    }
  }
  
}