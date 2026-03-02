import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private BASE = 'http://localhost:5000/api/students';

  constructor(private http: HttpClient, private auth: AuthService) { }

  private get headers() {
    return new HttpHeaders({ 'Authorization': `Bearer ${this.auth.token}` });
  }

  getProfile() { return this.http.get(`${this.BASE}/profile`, { headers: this.headers }); }
  updateProfile(data: any) { return this.http.put(`${this.BASE}/profile`, data, { headers: this.headers }); }
  getAttendance() { return this.http.get(`${this.BASE}/attendance`, { headers: this.headers }); }
  getFees() { return this.http.get(`${this.BASE}/fees`, { headers: this.headers }); }
  getMyEvents() { return this.http.get(`${this.BASE}/events`, { headers: this.headers }); }
}
