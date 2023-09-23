import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Profile, SupabaseService } from '../services/supabase/supabase.service'
import { Router } from '@angular/router'
import { FormControl, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {

  loading = false;
  public displayErrorMessage: boolean = false;
  public user: User | null = null;


  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required
  ]);

  matcher = new ErrorStateMatcher();

  signInForm = this.formBuilder.group({
    email: '',
    password: ''
  })

  constructor(
    private readonly supabase: SupabaseService,
    private readonly formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void { }

  async handleLogin(): Promise<void> {
    try {
      const email = this.signInForm.value.email as string;
      const password = this.signInForm.value.password as string;

      if (email != "" && password != "") {
        const user = await this.supabase.signIn(email, password);

        if (user.error && user.error.message == "Invalid login credentials") {
          alert("Email or password incorrect. Please try again.");
        } else {
          this.router.navigate(['account']);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      this.signInForm.reset()
    }
  }


  public async handleSignup(): Promise<void> {
    const email = this.signInForm.value.email as string;
    const password = this.signInForm.value.password as string;

    if (email != "" && password != "") {
      this.supabase.signUp(email, password).then((response) => {
        if (response.error) {
          if (response.error.message == "Email rate limit exceeded") {
            alert('Ha superado el límite de intentos. Por favor, inténtelo de nuevo más tarde.');
            this.displayErrorMessage = true;
          } else {
            alert('Ha ocurrido un error inesperado. Por favor, inténtelo de nuevo.');
            this.displayErrorMessage = true;
          }
        } else {
          this.user = response.data.user;
          this.createProfile();
          this.router.navigate(['account']);
        }
      });
    } else {
      alert('Por favor, introduce email y contraseña para poder registrarte.');
    }
  }

  private async createProfile() {
    // We create and insert a new profile for the new user if it doesn't exist
    if (this.user) {
      const mockProfile: Profile = {
        id: this.user.id,
        username: "Perfil de Pruebas",
        clase: "Mago",
        power: "Fuego",
        level: 0,
        weapon: "Espada",
      };

      console.log('Mock Profile creating.....: ', mockProfile);

      await this.supabase.insertProfile(mockProfile).then((response) => {
        if (response.error) {
          console.error('Ha ocurrido un error inesperado. Por favor, inténtelo de nuevo.');
        } else {
          console.log('Profile for user created successfully!!');
        }
      });
    }
  }

}