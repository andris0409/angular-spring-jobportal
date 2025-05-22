import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { PersonProfileData } from "./personProfileData";
import { JobService } from "../jobs/job-list/jobService";

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    baseUrl = 'http://localhost:8080/api';

    constructor(private http: HttpClient, private jobService: JobService) { }

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    saveProfile(profileData: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/person/save`, profileData, { responseType: 'text', headers: this.getAuthHeaders() })
    }

    downloadCv() {
        this.http.get(`${this.baseUrl}/person/cv`, { responseType: 'blob', headers: this.getAuthHeaders() })
            .subscribe(blob => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'cv.pdf';
                link.click();
                window.URL.revokeObjectURL(url);
            }, error => {
                console.error("Error downloading file", error);
            });
    }

    getProfile(): Observable<PersonProfileData> {
        return this.http.get<PersonProfileData>(`${this.baseUrl}/person/profile`, { headers: this.getAuthHeaders() });
    }

    getSavedJobs(): Observable<any> {
        return this.http.get(`${this.baseUrl}/person/get-saved-jobs`, { headers: this.getAuthHeaders() }).pipe(
            tap(() => {
                this.jobService.refreshJobs();
            })
        );
    }

    saveJob(jobId: string): Observable<any> {
        return this.http.post<string>(`${this.baseUrl}/person/save-job/${jobId}`, null, { responseType: 'text' as 'json', headers: this.getAuthHeaders() }).pipe(
            tap(() => {
                this.jobService.refreshJobs();
            })
        );
    }

    unsaveJob(jobId: string): Observable<any> {
        return this.http.delete<string>(`${this.baseUrl}/person/unsave-job/${jobId}`, { responseType: 'text' as 'json', headers: this.getAuthHeaders() }).pipe(
            tap(() => {
                this.jobService.refreshJobs();
            })
        );
    }

}