import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { JobService } from './jobService';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-job-list',
  standalone: false,
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.css'
})
export class JobListComponent implements OnInit {
  jobs: any[] = [];
  searchForm: FormGroup;

  constructor(private http: HttpClient, private toastservice: ToastrService, private router: Router, private jobservice: JobService, private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      selectedType: [''],
      selectedLocation: [''],
      selectedCategory: ['']
    });
  }

  ngOnInit() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    if (role === 'COMPANY') {
      this.jobservice.getJobsByCompany().subscribe({
        next: (response) => {
          this.jobs = response;
        },
        error: (error) => {
          console.log(error);
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
    else {
      this.toastservice.error('Unauthorized access');
    }
  }

  filteredJobs(): any[] {
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
