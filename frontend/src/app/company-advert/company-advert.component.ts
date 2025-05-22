import { Component } from '@angular/core';
import { CompanyService } from '../company-profile/companyService';
import { ActivatedRoute } from '@angular/router';
import { CompanyProfile } from '../company-profile/model/CompanyProfile';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-company-advert',
  standalone: false,
  templateUrl: './company-advert.component.html',
  styleUrl: './company-advert.component.css'
})
export class CompanyAdvertComponent {
  companyId: string | null = null;

  company!: CompanyProfile

  newComment: string = '';

  constructor(private service: CompanyService, private route: ActivatedRoute, private toast: ToastrService) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.companyId = params.get('id')!;
      this.loadCompany();
    });
  }

  loadCompany() {
    if (this.companyId) {
      this.service.getCompanyById(this.companyId).subscribe(
        (response: CompanyProfile) => {
          this.company = response;
        },
        (error: any) => {
          console.error('Error fetching company data:', error);
        }
      );
    }
  }

  submitComment() {
    if (this.newComment.trim() === '') {
      return; // Do not submit empty comments
    }

    this.service.addComment(this.company.id, this.newComment).subscribe(
      (response: any) => {
        this.toast.success('Comment submitted successfully!');
        this.newComment = '';
        this.loadCompany();
      },
      (error: any) => {
        this.toast.error('Error submitting comment:', error);
      }
    );
  }

  goBack(): void {
    window.history.back();
  }

}
