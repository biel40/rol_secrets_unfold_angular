import { Component, OnInit, Input } from '@angular/core';
import { Hability, Profile, SupabaseService } from '../services/supabase/supabase.service';
import { AuthSession, User } from '@supabase/supabase-js';
import { Location } from '@angular/common';
import { LoaderService } from '../services/loader/loader.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-attack-list-component',
  templateUrl: './attack-list-component.component.html',
  styleUrls: ['./attack-list-component.component.css']
})
export class AttackListComponent implements OnInit {

  calculatedProfile!: Profile;

  profile!: Profile;
  userHabilities!: Hability[];

  error: boolean = false;

  @Input()
  session!: AuthSession | null;

  constructor(
    private readonly supabase: SupabaseService,
    private location: Location,
    private loaderService: LoaderService,
    private dialog: MatDialog,
    private router: Router
  ) {
    if (localStorage.getItem('calculatedProfile') != null) {
      let sessionObject = JSON.parse(localStorage.getItem('calculatedProfile') as string);
      this.calculatedProfile = sessionObject.calculatedProfile;
    } else {
      const navigation = this.router.getCurrentNavigation();

      if (navigation?.extras.state) {
        localStorage.setItem('calculatedProfile', JSON.stringify(navigation?.extras.state as Profile));
        this.calculatedProfile = navigation?.extras.state as Profile;
      }
    }
  }

  async ngOnInit(): Promise<void> {
    this.loaderService.setLoading(true);

    await this.supabase.getSession().then((session) => {
      this.session = session;
    });

    await this.getProfile();
    await this.getHabilitiesFromUser(this.profile);
  }

  async getProfile() {
    try {

      this.supabase.getSession().then((session) => {
        this.session = session;
      });

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
    } catch (error) {
      if (error instanceof Error) {
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

      habilitiesFetched.then((habilitiesArray: any) => {
        habilitiesArray.forEach((hability: Hability) => {
          habilities.push(hability);
        });
        this.userHabilities = habilities;
      });
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      this.loaderService.setLoading(false);
    }
  }


  public addUses(hability: Hability) {
    try {
      this.loaderService.setLoading(true);
      hability.current_uses += 1;
      this.supabase.updateHability(hability);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      this.loaderService.setLoading(false);
    }
  }

  public removeUses(hability: Hability) {
    try {
      this.loaderService.setLoading(true);
      hability.current_uses -= 1;
      this.supabase.updateHability(hability);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      this.loaderService.setLoading(false);
    }
  }

  goBack() {
    this.location.back();
  }

  public calculateDamage(hability: Hability): void {
    try {
      this.loaderService.setLoading(true);

      let damage = 0;

      const profileProperties = Object.keys(this.calculatedProfile);

      for (const property of profileProperties) {
        const value = this.calculatedProfile[property as keyof Profile];

        if (property == hability.scales_with) {
          damage = Number(value) * this.profile.level;
        }
      }

      this.openModal(damage, hability.dice);

    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      this.loaderService.setLoading(false);
    }
  }

  public openModal(damage: number, dice: string) {

    const dialogRef = this.dialog.open(ModalComponent, {
      width: '600px',
      data: { damage: damage, dice: dice }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal cerrado');
    });
  }
}
