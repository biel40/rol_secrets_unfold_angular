import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { SupabaseService } from '../supabase.service'
import { Router } from '@angular/router'
import { FormControl, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {

  loading = false;
  public displayErrorMessage: boolean = false;

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

      // Sign In with Email and Password
      const user = await this.supabase.signIn(email, password);

      if (user.error && user.error.message == "Invalid login credentials") {
        alert("Email or password incorrect. Please try again.");
      } else {
        this.goToAccount();
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

    this.supabase.signUp(email, password).then((response) => {
      console.log(response);
      if (response.error) {
        if (response.error.message == "Email rate limit exceeded") {
          alert('Ha superado el límite de intentos. Por favor, inténtelo de nuevo más tarde.');
          this.displayErrorMessage = true;
          console.log(this.displayErrorMessage);
        } else {
          alert('Ha ocurrido un error inesperado. Por favor, inténtelo de nuevo.');
          this.displayErrorMessage = true;
          console.log(this.displayErrorMessage);
        }
      } else {
        this.goToAccount();
      }
    });
  }

  private goToAccount() {
    this.router.navigate(['account']);
  }

}