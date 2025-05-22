import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { JobService } from '../jobs/job-list/jobService';
import { ProfileService } from '../person-profile/profileService';
import { ApplicationService } from '../application-item/ApplicationService';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-action',
  standalone: false,
  templateUrl: './job-action.component.html',
  styleUrl: './job-action.component.css'
})
export class JobActionComponent {

  @Input() job: any;
  @Output() jobUnsaved = new EventEmitter<any>();

  userRole: string | null = null;

  constructor(private jobService: JobService,
    private profileService: ProfileService,
    private applicationService: ApplicationService,
    private toastService: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role');
    this.jobService.jobs$.subscribe(jobs => {
      const job = jobs.find((job: any) => job.id === this.job.id);
      if (job) {
        this.job = job;
      }
    });
  }

  onDelete(id: number) {
    const jobElement = document.getElementById(`job-${id}`);
    this.jobService.deleteJob(id).subscribe(
      (response) => {
        this.toastService.success('Job deleted successfully!');
        this.jobService.refreshJobs();
        setTimeout(() => {
          // Call a method to refresh the job list
        }, 300);
      },
      (error) => {
        const errorMessage = typeof error.error === 'string'
          ? error.error
          : error.error?.message || 'Job deletion failed. Please try again.';
        this.toastService.error(errorMessage);
      }
    );
  }

  onEdit(id: number) {
    this.router.navigate(['/edit-job', id]);
  }

  onSeeApplications(id: number) {
    this.router.navigate(['/application-list', id]);
  }

  onApply(id: number) {
    this.applicationService.addApplication(id).subscribe(
      (response) => {
        this.toastService.success('Application submitted successfully!');
      },
      (error) => {
        const errorMessage = typeof error.error === 'string' ? error.error : 'Failed to submit application.';
        this.toastService.error(errorMessage);
      }
    );
  }

  onSave(id: number) {
    this.profileService.saveJob(id.toString()).subscribe(
      (response: string) => {
        this.toastService.success(response);
      },
      (error) => {
        const errorMessage = typeof error.error === 'string' ? error.error : 'Failed to save job.';
        this.toastService.error(errorMessage)
      });
  }

  onUnsave(id: number) {
    this.profileService.unsaveJob(id.toString()).subscribe(
      (response: string) => {
        this.toastService.success(response);
        this.jobUnsaved.emit(id);
      },
      (error) => {
        const errorMessage = typeof error.error === 'string' ? error.error : 'Failed to unsave job.';
        this.toastService.error(errorMessage)
      });
  }
}
