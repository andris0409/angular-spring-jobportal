import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    baseUrl = 'http://localhost:8080/api/users';

    constructor(private http: HttpClient) { }

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    getRole(): Observable<string> {
        return this.http.get(`${this.baseUrl}/role`, { headers: this.getAuthHeaders(), responseType: 'text' });
    }

    login(username: string, password: string): Observable<any> {
        const body = {
            username: username,
            password: password
        }
        return this.http.post<any>(`${this.baseUrl}/login`, body, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}