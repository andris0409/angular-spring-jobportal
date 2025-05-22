import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from '../jobs/job-list/jobService';
import { ApplicationService } from '../application-item/ApplicationService';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { ProfileService } from '../person-profile/profileService';

@Component({
  selector: 'app-job-detail',
  standalone: false,
  templateUrl: './job-detail.component.html',
  styleUrl: './job-detail.component.css'
})
export class JobDetailComponent implements OnInit {
  job: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private applicationService: ApplicationService,
    private profileService: ProfileService,
    private toastr: ToastrService,
    private location: Location
  ) { }

  ngOnInit() {
    this.jobService.jobs$.subscribe(jobs => {
      const jobId = this.route.snapshot.paramMap.get('id');
      if (jobId) {
        const job = jobs.find((job: any) => job.id === Number(jobId));
        if (job) {
          this.job = job;
        }
      }
    });
    this.jobService.refreshJobs();
  }

  apply() {
    const jobId = Number(this.route.snapshot.paramMap.get('id')) || 0;
    this.applicationService.addApplication(jobId).subscribe(
      response => {
        this.toastr.success('Application submitted successfully!');
      },
      error => {
        const errorMessage = typeof error.error === 'string' ? error.error : 'Failed to submit application.';
        this.toastr.error(errorMessage);
      }
    );
  }

  save() {
    const jobId = this.route.snapshot.paramMap.get('id') || "0";
    this.profileService.saveJob(jobId).subscribe(
      (response: string) => {
        this.toastr.success(response);
      },
      (error) => {
        const errorMessage = typeof error.error === 'string' ? error.error : 'Failed to save job.';
        this.toastr.error(errorMessage)
      })
  }

  goBack() {
    this.location.back();
  }
}
