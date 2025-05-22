import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from './profileService';
import { ApplicationService } from '../application-item/ApplicationService';
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-person-profile',
  standalone: false,
  templateUrl: './person-profile.component.html',
  styleUrl: './person-profile.component.css'
})
export class PersonProfileComponent implements OnInit {
  profileForm!: FormGroup;
  selectedCV: File | null = null;
  existingCVName: string | null = null

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private profileService: ProfileService,
    private applicationService: ApplicationService,
    private toastService: ToastrService
  ) { }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
      birthDate: [''],
    });

    this.profileService.getProfile().subscribe((profileData) => {
      this.profileForm.patchValue({
        fullName: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
        address: profileData.address,
        birthDate: profileData.birthDate,
      });
      if (profileData.cv && typeof profileData.cv === 'string') {
        const byteCharacters = atob(profileData.cv);
        const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);
        this.selectedCV = new File([byteArray], 'cv.pdf', {
          type: 'application/pdf'
        });
        this.existingCVName = this.selectedCV.name;
      }
    }, (error: any) => {
      console.error('Error getting profile', error);
    });
  }


  saveProfile(): void {
    if (this.profileForm.valid) {
      const formData = new FormData();

      const profileData = {
        fullName: this.profileForm.value.fullName,
        email: this.profileForm.value.email,
        phone: this.profileForm.value.phone,
        address: this.profileForm.value.address,
        birthDate: this.profileForm.value.birthDate
      };
      formData.append('personProfile', JSON.stringify(profileData));

      if (this.selectedCV) {
        formData.append('cv', this.selectedCV, this.selectedCV.name);
      }

      this.profileService.saveProfile(formData).subscribe({
        next: (response: string) => {
          this.toastService.success(response);
          setTimeout(() => this.goBack(), 1000);
        },
        error: (error: any) => {
          const message = typeof error.error === 'string'
            ? error.error
            : error.message || 'Unexpected error occurred';
          this.toastService.error(message);
        }
      });

    } else {
      this.toastService.warning('Please fill in all required fields.');
      console.error('Please fill in all required fields.');
    }
  }


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.type === 'application/pdf') {
        this.selectedCV = file;
      } else {
        alert('Please select a PDF file.');
        input.value = '';
      }
    }
  }

  goToApplications() {
    this.router.navigate(['/user-applications']);
  }

  removeCv() {
    this.selectedCV = null;
    this.existingCVName = null;
  }

  downloadCv(): void {
    if (this.selectedCV) {
      this.applicationService.downloadCv(this.selectedCV);
    } else {
      console.error('No CV available for download.');
    }
  }

  showSavedJobs() {
    this.router.navigate(['/saved-jobs']);
  }

  goBack(): void {
    this.router.navigate(['joblist']);
  }

  signOut(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}