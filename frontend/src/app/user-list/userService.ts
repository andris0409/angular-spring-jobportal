import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PersonProfile } from "../person-profile-card/PersonProfile";
import { CompanyProfile } from "../company-profile-card/ComapnyProfile";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private baseUrl = 'http://localhost:8080/api';

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    constructor(private http: HttpClient) { }

    getPersonUsers(): Observable<PersonProfile[]> {
        return this.http.get<PersonProfile[]>(`${this.baseUrl}/person/all-profiles`, { headers: this.getAuthHeaders() });
    }

    getCompanyUsers(): Observable<CompanyProfile[]> {
        return this.http.get<CompanyProfile[]>(`${this.baseUrl}/company/all-profiles`, { headers: this.getAuthHeaders() });
    }

    deleteUser(userId: string) {
        return this.http.delete(`${this.baseUrl}/users/delete/${userId}`, { responseType: 'text', headers: this.getAuthHeaders() });
    }

    deleteComment(companyId: string, comment: string) {
        const body = {
            companyId: companyId,
            comment: comment
        };
        console.log(body)
        return this.http.delete(`${this.baseUrl}/company/deletecomment`, { body: body, responseType: 'text', headers: this.getAuthHeaders() });
    }
}
