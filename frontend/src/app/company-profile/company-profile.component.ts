import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from './companyService';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CompanyProfile } from './model/CompanyProfile';
import { MatDialog } from '@angular/material/dialog';
import { CommentDialogComponent } from '../comment-dialog/comment-dialog.component';

@Component({
  selector: 'app-company-profile',
  standalone: false,
  templateUrl: './company-profile.component.html',
  styleUrl: './company-profile.component.css'
})
export class CompanyProfileComponent {
  companyForm!: FormGroup;
  selectedLogoFile: File | null = null;
  logoPreviewUrl: string | null = null;
  comments: string[] = [];

  constructor(private fb: FormBuilder,
    private service: CompanyService,
    private toastService: ToastrService,
    private dialog: MatDialog,
    private router: Router) { }

  ngOnInit(): void {
    this.companyForm = this.fb.group({
      companyName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
      website: [''],
      description: ['']
    });

    this.service.loadProfile().subscribe((companyData: CompanyProfile) => {
      this.companyForm.patchValue({
        companyName: companyData.companyName,
        email: companyData.email,
        phone: companyData.phone,
        address: companyData.address,
        website: companyData.website,
        description: companyData.description
      });
      this.comments = companyData.comments || [];
      if (companyData.logo && typeof companyData.logo === 'string') {
        const byteCharacters = atob(companyData.logo);
        const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);
        this.selectedLogoFile = new File([byteArray], 'profile.jpg', {
          type: 'image/jpeg'
        });
      }
      if (companyData.logo) {
        this.logoPreviewUrl = `data:image/jpeg;base64,${companyData.logo}`;
      }
    }, (error: any) => {
      console.error('Error getting company profile', error);
    });
  }

  onLogoSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedLogoFile = fileInput.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedLogoFile);
    }
  }

  saveCompany(): void {
    console.log("saving company");
    if (this.companyForm.valid) {
      const formData = new FormData();

      const companyData = {
        companyName: this.companyForm.value.companyName,
        email: this.companyForm.value.email,
        phone: this.companyForm.value.phone,
        address: this.companyForm.value.address,
        website: this.companyForm.value.website,
        description: this.companyForm.value.description
      };

      formData.append('companyProfile', JSON.stringify(companyData));

      if (this.selectedLogoFile) {
        formData.append('logo', this.selectedLogoFile, this.selectedLogoFile.name);
      }

      this.service.saveProfile(formData).subscribe({
        next: (response) => {
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
    }
  }


  removeLogo(): void {
    this.selectedLogoFile = null;
    this.logoPreviewUrl = null;

    // Clear the file input value to allow re-uploading the same file
    const fileInput = document.getElementById('logoUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  openComments(comments: string[]) {
    this.dialog.open(CommentDialogComponent, {
      width: '400px',
      data: comments
    });
  }

  signOut(): void {
    localStorage.clear();
    this.router.navigate(['login']);
  }

  goBack(): void {
    this.router.navigate(['joblist']);
  }


}
