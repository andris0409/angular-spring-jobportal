import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PersonProfileData } from "./personProfileData";

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    baseUrl = 'http://localhost:8080/api';

    constructor(private http: HttpClient) { }

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    saveProfile(profileData: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/person/save`, profileData, { headers: this.getAuthHeaders() });
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

}