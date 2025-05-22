import { Component } from '@angular/core';
import { ApplicationService } from '../application-item/ApplicationService';
import { JobData } from '../jobs/job-list/model/jobData';
import { ToastrService } from 'ngx-toastr';

interface ApplicationWithJob {
  applicationId: number;
  job: JobData;
}

@Component({
  selector: 'app-user-application-list',
  standalone: false,
  templateUrl: './user-application-list.component.html',
  styleUrl: './user-application-list.component.css'
})
export class UserApplicationListComponent {

  applications: any[] = [];
  appliedJobs: ApplicationWithJob[] = [];

  constructor(private service: ApplicationService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.service.getUserApplications().subscribe({
      next: (data: any[]) => {
        this.appliedJobs = data.map(app => ({
          applicationId: app.id,
          job: app.jobdto
        }));
      },
      error: (error: any) => {
        this.toastr.error('Error fetching applications', error);
      }
    });
  }


  cancelApplication(applicationId: number): void {
    this.service.deleteApplication(applicationId).subscribe({
      next: () => {
        this.toastr.success('Application deleted successfully');
        setTimeout(() => {
          this.loadApplications();
        }, 1000);
      },
      error: (error: any) => {
        this.toastr.error('Error deleting application', error);
      }
    });
  }
}
