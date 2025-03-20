import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: false,
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Input()
  isChecked: boolean = false;

  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      isCompany: [false, Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { username, password, email, isCompany } = this.registerForm.value;
      const role = isCompany ? 'COMPANY' : 'PERSON';
      const body = { username, password, email, role };

      console.log('Request Body:', body);

      this.http.post<any>('http://localhost:8080/api/users/register', body, {
        headers: { 'Content-Type': 'application/json' }
      }).subscribe({
        next: (response) => {
          console.log("Response received:", response);
        },
        error: (error) => {
          console.error("Error response:", error);
        }
      });
      console.log('Form Submitted', this.registerForm.value);
    }
  }
}
