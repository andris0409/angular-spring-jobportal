import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { JobService } from '../jobs/job-list/jobService';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ApplicationService } from '../application-item/ApplicationService';
import { ProfileService } from '../person-profile/profileService';
import { JobData } from '../jobs/job-list/model/jobData';

@Component({
  selector: 'app-job-item',
  standalone: false,
  templateUrl: './job-item.component.html',
  styleUrl: './job-item.component.css'
})
export class JobItemComponent implements OnInit {
  @Input() job!: JobData;
  @Output() jobSelected = new EventEmitter<any>();
  @Output() jobUnsaved = new EventEmitter<void>();

  userRole: string | null = null;

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role');
  }

  constructor(private jobService: JobService,
    private profileService: ProfileService,
    private applicationService: ApplicationService,
    private toastService: ToastrService,
    private router: Router) { }

  handleClick() {
    this.jobSelected.emit(this.job.id);
  }

  handleJobUnsaved(id: number) {
    this.jobUnsaved.emit();
  }


}
