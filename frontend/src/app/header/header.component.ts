import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() title: string = '';
  userRole: string = '';

  constructor(public router: Router) { }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role') || '';
  }

  openProfile(): void {
    this.router.navigate(['/profile']);
  }

  createJob(): void {
    this.router.navigate(['/create-job']);
  }

  userList(): void {
    this.router.navigate(['/userlist']);
  }

  goBack(): void {
    window.history.back();
  }
}
