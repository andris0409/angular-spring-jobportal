import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CompanyProfile } from './ComapnyProfile';

@Component({
  selector: 'app-company-profile-card',
  standalone: false,
  templateUrl: './company-profile-card.component.html',
  styleUrl: './company-profile-card.component.css'
})
export class CompanyProfileCardComponent {
  @Input() company!: CompanyProfile;
  @Output() delete = new EventEmitter<string>();
  @Output() viewComments = new EventEmitter<string>();

  onDelete(): void {
    this.delete.emit(this.company.id);
  }

  onViewComments(): void {
    this.viewComments.emit(this.company.id);
  }
}
