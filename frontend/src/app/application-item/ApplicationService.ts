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

    downloadCv(cv: Blob | File): void {
        if (cv instanceof Blob) {
            const url = URL.createObjectURL(cv);
            const fileName = cv instanceof File ? cv.name : 'cv.pdf'; // fallback name

            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.click();

            URL.revokeObjectURL(url);
        } else {
            console.error('Invalid CV format — expected Blob or File:', cv);
        }
    }


}