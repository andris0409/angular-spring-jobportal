import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login/loginservice';

@Component({
  selector: 'app-dynamic-profile-component',
  standalone: false,
  template: '',
  styleUrl: './dynamic-profile-component.component.css'
})
export class DynamicProfileComponentComponent implements OnInit {
  constructor(
    private loginservice: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginservice.getRole().subscribe(role => {
      if (!role) {
        this.router.navigate(['/login']);
        return;
      }

      if (role === 'PERSON') {
        this.router.navigate(['/profile/person']);
      } else if (role === 'COMPANY') {
        this.router.navigate(['/profile/company']);
      } else if (role === 'ADMIN') {
        this.router.navigate(['/profile/admin']);
      }
      else {
        this.router.navigate(['/']);
      }
    });
  }
}


