import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CompanyProfile } from "./model/CompanyProfile";

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    constructor(private http: HttpClient) { }

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    private baseUrl = 'http://localhost:8080/api/company';

    getCompanyById(id: string): Observable<CompanyProfile> {
        console.log("Fetching company profile with ID:", id);
        return this.http.get<CompanyProfile>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
    }

    saveProfile(profileData: any): Observable<any> {
        console.log("Saving company profile", profileData);
        return this.http.post(`${this.baseUrl}/save`, profileData, { responseType: 'text', headers: this.getAuthHeaders() });
    }

    loadProfile(): Observable<CompanyProfile> {
        return this.http.get<CompanyProfile>(`${this.baseUrl}/profile`, { headers: this.getAuthHeaders() });
    }

    addComment(id: string, comment: string): Observable<any> {
        const body = {
            companyId: id,
            comment: comment
        };
        console.log("Adding comment:", body);
        return this.http.post(`${this.baseUrl}/addcomment`, body, { responseType: 'text', headers: this.getAuthHeaders() });
    }
}