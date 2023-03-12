import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { SupabaseService } from '../supabase.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  loading = false

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

  async onSubmit(): Promise<void> {
    try {
      this.loading = true

      const email = this.signInForm.value.email as string;
      const password = this.signInForm.value.password as string;

      console.log(email);

      if (email === "" || password === "") {
        alert("Email or password fields are empty!");
      }

      const user = await this.supabase.signIn(email, password);

      if (user.error && user.error.message === "Invalid login credentials") {
        alert("Email or password incorrect. Please try again.");
      } else {
        alert("Login completed for user " + email);
        this.goToAccount();
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      this.signInForm.reset()
      this.loading = false
    }
  }

  private goToAccount() {
    this.router.navigate(['account']);
  }

}