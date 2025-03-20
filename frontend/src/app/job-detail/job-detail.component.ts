import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '../jobs/job-list/jobService';
import { ApplicationService } from './ApplicationService';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

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
    private jobService: JobService,
    private applicationService: ApplicationService,
    private toastr: ToastrService,
    private location: Location
  ) { }

  ngOnInit() {
    const jobId = this.route.snapshot.paramMap.get('id') || '';
    this.jobService.getJobById(jobId).subscribe(job => {
      this.job = job;
    });
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
    // Handle save action
  }

  goBack() {
    this.location.back();
  }
}
