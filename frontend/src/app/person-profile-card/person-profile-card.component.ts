import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PersonProfile } from './PersonProfile';

@Component({
  selector: 'app-person-profile-card',
  standalone: false,
  templateUrl: './person-profile-card.component.html',
  styleUrl: './person-profile-card.component.css'
})
export class PersonProfileCardComponent {
  @Input() profile!: PersonProfile
  @Output() delete = new EventEmitter<string>();

  downloadCv(): void {
    if (!this.profile.cv) return;

    const byteCharacters = atob(this.profile.cv);
    const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.profile.fullName}_CV.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  onDelete(): void {
    if (!this.profile.id)
      console.error('Profile ID is missing');
    else
      this.delete.emit(this.profile.id);
  }

}
