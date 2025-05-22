import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { JobData } from './model/jobData';

@Injectable({
    providedIn: 'root'
})
export class JobService {
    private baseUrl = 'http://localhost:8080/api/jobs';

    private jobsSubject = new BehaviorSubject<any[]>([]);
    jobs$ = this.jobsSubject.asObservable();

    constructor(private http: HttpClient) { }

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    refreshJobs(filters: any = {}, page = 0, size = 10, sort = 'title,asc'): void {
        this.getFilteredJobs(filters, page, size, sort)
            .subscribe(response => {
                this.jobsSubject.next(response.content); // or entire response if needed
            });
    }


    getJobs(): Observable<any> {
        return this.http.get(`${this.baseUrl}/get-all`, { headers: this.getAuthHeaders() });
    }

    getJobById(id: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/get/${id}`, { headers: this.getAuthHeaders() });
    }

    getJobsByCompany(): Observable<any> {
        return this.http.get(`${this.baseUrl}/get-by-company`, {
            headers: this.getAuthHeaders()
        });
    }

    addJob(jobData: JobData): Observable<any> {
        return this.http.post(`${this.baseUrl}/add`, jobData, { headers: this.getAuthHeaders() });
    }

    updateJob(id: number, jobData: JobData): Observable<any> {
        return this.http.put(`${this.baseUrl}/update/${id}`, jobData, { headers: this.getAuthHeaders(), responseType: 'text' });
    }

    deleteJob(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/delete/${id}`, { headers: this.getAuthHeaders() });
    }

    fetchApplications(id: number): Observable<any> {
        return this.http.get(`${this.baseUrl}/get-applications/${id}`, { headers: this.getAuthHeaders() });
    }

    getFilteredJobs(filters: any = {}, page = 0, size = 10, sort = 'title,asc'): Observable<any> {
        let params = new HttpParams()
            .set('page', page)
            .set('size', size)
            .set('sort', sort);

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params = params.set(key, String(value));
            }
        });

        return this.http.get(`${this.baseUrl}/filteredJobs`, {
            headers: this.getAuthHeaders(),
            params
        });
    }


}