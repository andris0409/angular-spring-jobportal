import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobService } from '../jobs/job-list/jobService';
import { Toast, ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-job',
  standalone: false,
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.css']
})
export class CreateJobComponent implements OnInit {
  jobForm!: FormGroup;
  typeOptions: string[] = ['Full-time', 'Part-time', 'Contract'];
  categoryOptions: string[] = ['Engineering', 'Marketing', 'Sales'];
  currentJobId: string | null = null;


  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private jobService: JobService, private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      location: ['', Validators.required],
      type: ['', Validators.required],
      category: ['', Validators.required],
      description: ['']
    });
    this.currentJobId = this.route.snapshot.paramMap.get('jobId');
    if (this.currentJobId) {
      this.jobService.getJobById(this.currentJobId).subscribe(
        job => {
          this.jobForm.patchValue({
            title: job.title,
            location: job.location,
            type: job.type,
            category: job.category,
            description: job.description
          });
        },
        error => {
          this.toastr.error('Failed to load job details.');
        }
      );
    }
  }

  createJob(): void {
    if (this.jobForm.valid) {
      const jobData = this.jobForm.value;
      if (this.currentJobId) {
        let id = (Number(this.currentJobId));
        this.jobService.updateJob(id, jobData).subscribe(
          () => {
            this.toastr.success('Job updated successfully!');
            setTimeout(() => {
              window.history.back();
            }, 500);
            (error: any) => {
              const errorMessage = typeof error.error === 'string'
                ? error.error
                : error.error?.message || 'Job update failed. Please try again.';
              this.toastr.error(errorMessage);
            }
          }
        );
      } else {
        this.jobService.addJob(jobData).subscribe(
          (response) => {
            this.toastr.success('Job created successfully!');
            setTimeout(() => {
              window.history.back();
            }, 500);
          },
          (error) => {
            const errorMessage = typeof error.error === 'string'
              ? error.error
              : error.error?.message || 'Job creation failed. Please try again.';
            this.toastr.error(errorMessage);
          }
        );
      }
    }
    else {
      this.toastr.error('Please fill in all required fields.');
    }
  }


  goBack(): void {
    window.history.back();
  }
}
