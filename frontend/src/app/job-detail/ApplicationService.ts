import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ApplicationService {
    constructor(private http: HttpClient) { }

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    private baseUrl = 'http://localhost:8080/api/applications';

    getApplications(): Observable<any> {
        return this.http.get(`${this.baseUrl}/get-all`, { headers: this.getAuthHeaders() });
    }

    getApplicationById(id: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/get/${id}`, { headers: this.getAuthHeaders() });
    }

    addApplication(jobId: number): Observable<any> {
        return this.http.post(`${this.baseUrl}/add`, jobId, { headers: this.getAuthHeaders() });
    }

    deleteApplication(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/delete/${id}`, { headers: this.getAuthHeaders() });
    }
}