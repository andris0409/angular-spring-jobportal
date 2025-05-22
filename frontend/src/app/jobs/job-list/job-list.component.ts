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

  constructor(private http: HttpClient, private toastservice: ToastrService,
    private router: Router,
    private jobservice: JobService,
    private profileService: ProfileService,
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
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    if (role === 'COMPANY') {
      this.jobservice.getJobsByCompany().subscribe({
        next: (response) => {
          this.jobs = response;
        },
        error: (error) => {
          this.toastservice.error(error?.error || 'Error while fetching jobs');
        }
      });
    }
    else if (role === 'PERSON') {
      this.jobservice.getJobs().subscribe({
        next: (response) => {
          this.jobs = response;
        },
        error: (error) => {
          this.toastservice.error(error?.error || 'Error while fetching jobs');
        }
      });
    }
    else if (role === 'ADMIN') {
      this.jobservice.getJobs().subscribe({
        next: (response) => {
          this.jobs = response;
        },
        error: (error) => {
          this.toastservice.error(error?.error || 'Error while fetching jobs');
        }
      });
    }
    else {
      this.toastservice.error('Unauthorized access');
    }
  }



  filteredJobs(): JobData[] {
    const { searchTerm, selectedType, selectedLocation, selectedCategory } = this.searchForm.value;

    return this.jobs.filter(job => {
      const termMatch = searchTerm
        ? job.title.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      const typeMatch = selectedType ? job.type === selectedType : true;
      const locationMatch = selectedLocation
        ? job.location.toLowerCase().includes(selectedLocation.toLowerCase())
        : true;
      const categoryMatch = selectedCategory
        ? job.category.toLowerCase().includes(selectedCategory.toLowerCase())
        : true;

      return termMatch && typeMatch && locationMatch && categoryMatch;
    });
  }


  goToDetails(jobId: string) {
    this.router.navigate(['/job-details', jobId]);
  }
}
