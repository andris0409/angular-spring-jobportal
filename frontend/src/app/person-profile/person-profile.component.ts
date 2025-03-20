import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ProfileService } from './profileService';

@Component({
  selector: 'app-person-profile',
  standalone: false,
  templateUrl: './person-profile.component.html',
  styleUrl: './person-profile.component.css'
})
export class PersonProfileComponent implements OnInit {
  profileForm!: FormGroup;
  selectedCV: File | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    // Initialize the form
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
      birthDate: ['']
    });

    // Optionally, load existing profile data and patch the form
    // this.profileService.getProfile().subscribe(profile => {
    //   this.profileForm.patchValue(profile);
    // });
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
      this.profileService.saveProfile(formData).subscribe(() => {
        next: () => {
          this.goBack();
        }
        (error: any) => {
          console.error('Error saving profile', error);
        }
      });
    } else {
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

  goBack(): void {
    this.profileService.downloadCv();
    this.location.back();
  }
}