import { Component, Input } from '@angular/core';
import { ApplicationService } from './ApplicationService';

@Component({
  selector: 'app-application-item',
  standalone: false,
  templateUrl: './application-item.component.html',
  styleUrl: './application-item.component.css'
})
export class ApplicationItemComponent {

  @Input() user: any;

  constructor(private service: ApplicationService) { }

  downloadCv() {
    let cvFile: File | null = null;
    if (this.user.cv && typeof this.user.cv === 'string') {
      const byteCharacters = atob(this.user.cv);
      const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);
      cvFile = new File([byteArray], 'cv.pdf', {
        type: 'application/pdf'
      });
    }
    if (cvFile) {
      this.service.downloadCv(cvFile);
    } else {
      console.error('No CV file available to download.');
    }
  }

}
