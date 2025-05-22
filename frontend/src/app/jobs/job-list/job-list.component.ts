import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { JobService } from './jobService';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from '../../person-profile/profileService';
import { JobData } from './model/jobData';

@Component({
  selector: 'app-job-list',
  standalone: false,
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.css'
})
export class JobListComponent implements OnInit {
  jobs: JobData[] = [];
  searchForm: FormGroup;
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;

  categories = [
    { value: '', label: 'All' },
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'it', label: 'IT / Software Development' },
    { value: 'finance', label: 'Finance / Accounting' },
    { value: 'hr', label: 'HR / Recruitment' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'design', label: 'Design' },
    { value: 'customer-support', label: 'Customer Support' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'other', label: 'Other' }
  ];

  constructor(private toastservice: ToastrService,
    private router: Router,
    private jobservice: JobService,
    private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      selectedType: [''],
      selectedLocation: [''],
      selectedCategory: ['']
    });
  }

  ngOnInit() {
    this.jobservice.jobs$.subscribe(jobs => {
      this.jobs = jobs;
    });
    this.searchJobs();
  }

  searchJobs(page = 0): void {
    this.currentPage = page;

    const filters = this.searchForm.value;

    this.jobservice.getFilteredJobs(filters, page, this.pageSize).subscribe({
      next: (response) => {
        this.jobs = response.content;
        this.totalPages = response.totalPages;
      },
      error: (err) => {
        this.toastservice.error(err?.error || 'Error while fetching jobs');
      }
    });
  }

  goToDetails(jobId: string) {
    this.router.navigate(['/job-details', jobId]);
  }
}
