import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '../jobs/job-list/jobService';

@Component({
  selector: 'app-application-list',
  standalone: false,
  templateUrl: './application-list.component.html',
  styleUrl: './application-list.component.css'
})
export class ApplicationListComponent implements OnInit {

  id!: number;
  applications: any[] = [];

  constructor(
    private httpClient: HttpClient,
    private jobservice: JobService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.id = +idParam; // Convert to number
        this.fetchApplications();
      } else {
        console.log('No id provided');
      }
    });
  }

  fetchApplications(): void {
    console.log(this.id);
    this.jobservice.fetchApplications(this.id).subscribe({
      next: (response) => {
        this.applications = response;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
