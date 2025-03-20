import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { JobService } from '../jobs/job-list/jobService';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { JobListComponent } from '../jobs/job-list/job-list.component';
import { ApplicationService } from '../job-detail/ApplicationService';

@Component({
  selector: 'app-job-item',
  standalone: false,
  templateUrl: './job-item.component.html',
  styleUrl: './job-item.component.css'
})
export class JobItemComponent implements OnInit {
  @Input() job: any;
  @Output() jobSelected = new EventEmitter<any>();

  userRole: string | null = null;

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role');
  }

  constructor(private jobService: JobService,
    private applicationService: ApplicationService,
    private toastService: ToastrService,
    private jobListComponent: JobListComponent,
    private router: Router) { }


  handleClick() {
    this.jobSelected.emit(this.job.id);
  }

  onDelete(id: number) {
    const jobElement = document.getElementById(`job-${id}`);
    this.jobService.deleteJob(id).subscribe(
      (response) => {
        this.toastService.success('Job deleted successfully!');
        setTimeout(() => {
          this.jobListComponent.ngOnInit();
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
  }
}
