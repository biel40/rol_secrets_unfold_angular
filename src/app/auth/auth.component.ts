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
      // this.loading = false
    }
  }

  public async handleSignup(): Promise<void> {
    const email = this.signInForm.value.email as string;
    const password = this.signInForm.value.password as string;

    // We try to sign in first
    const userSignin = await this.supabase.signIn(email, password);

    // If the user doesn't exist, we create it
    if (userSignin.error && userSignin.error.message == "Invalid login credentials") {
      const userSignup = await this.supabase.signUp(email, password);

      if (userSignup.error) {
        throw userSignup.error;
      } else {
        alert("User created successfully! Please confirm your email.");
        this.loading = true;
        this.goToAccount();
      }
    } else {
      throw new Error("User already exists!");
    }
  }

  private goToAccount() {
    this.router.navigate(['account']);
  }

}