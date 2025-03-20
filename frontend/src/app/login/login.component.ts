import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from './loginservice';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private service: LoginService,
    private toastService: ToastrService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.service.login(this.loginForm.value.username, this.loginForm.value.password).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          this.service.getRole().subscribe({
            next: (role: string) => {
              localStorage.setItem('role', role);
              this.router.navigate(['/joblist']);
            },
            error: (error) => {
              const errMsg = error?.error || 'Unknown error occurred while fetching role.';
              this.toastService.error(errMsg);
              console.error(error);
            }
          });
        },
        error: (error) => {
          const errMsg = error?.error || 'Login failed. Please try again.';
          this.toastService.error(errMsg);
          console.error(error);
        }
      });
    }
  }
}
