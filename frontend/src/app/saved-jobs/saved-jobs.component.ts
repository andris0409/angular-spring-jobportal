import { Component } from '@angular/core';
import { ProfileService } from '../person-profile/profileService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-saved-jobs',
  standalone: false,
  templateUrl: './saved-jobs.component.html',
  styleUrl: './saved-jobs.component.css'
})
export class SavedJobsComponent {
  savedJobs: any[] = [];

  constructor(private profileService: ProfileService, private router: Router) { }

  ngOnInit(): void {
    this.loadJobs();
  }


  loadJobs() {
    this.profileService.getSavedJobs().subscribe((savedJobs) => {
      this.savedJobs = savedJobs;
    }, (error: any) => {
      console.error('Error getting saved jobs', error);
    });
  }

  goToDetails(jobId: string) {
    this.router.navigate(['/job-details', jobId]);
  }

  goBack() {
    this.router.navigate(['/joblist']);
  }
}
