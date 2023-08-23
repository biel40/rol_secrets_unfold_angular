import { Component, Input, OnInit } from '@angular/core';
import { Profile, SupabaseService } from '../supabase.service';
import { AuthSession } from '@supabase/supabase-js';
import { LoaderService } from '../loader.service';
import { Router } from '@angular/router';

interface Stats {
  intimidation: number;
  persuasion: number;
  perception: number;
  stealth: number;
  acrobatics: number;
  athletics: number;
  survival: number;
  medicine: number;
  religion: number;
  arcana: number;
  history: number;
  nature: number;
  animal_handling: number;
  insight: number;
  performance: number;
}

@Component({
  selector: 'app-check-rol-stats',
  templateUrl: './check-rol-stats.component.html',
  styleUrls: ['./check-rol-stats.component.css']
})
export class CheckRolStatsComponent implements OnInit {

  public stats: Stats = {
    intimidation: 0,
    persuasion: 0,
    perception: 0,
    stealth: 0,
    acrobatics: 0,
    athletics: 0,
    survival: 0,
    medicine: 0,
    religion: 0,
    arcana: 0,
    history: 0,
    nature: 0,
    animal_handling: 0,
    insight: 0,
    performance: 0,
  }

  profile!: Profile;
  calculatedProfile!: Profile;

  @Input()
  session!: AuthSession | null;

  constructor(
    private readonly supabase: SupabaseService,
    private loaderService: LoaderService,
    private router: Router
  ) {
    if (localStorage.getItem('calculatedProfile') != null){
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
    await this.calculateStats();
  }

  public calculateStats() {
    // Las estadísticas dependen de la clase del jugador (profile)
    console.log(this.calculatedProfile);
    if (this.calculatedProfile) {
      
    }
  }


  public getStatKeys(): string[] {
    return Object.keys(this.stats);
  }

  public getStatValue(stat: string): number {
    return this.stats[stat as keyof Stats];
  }

  public goBack(): void {
    window.history.back();
  }

}
