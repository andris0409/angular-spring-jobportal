import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-profile',
  standalone: false,
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css'
})
export class AdminProfileComponent {
  constructor(private router: Router) { }

  goBack(): void {
    this.router.navigate(['/joblist']);
  }

  signOut(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
