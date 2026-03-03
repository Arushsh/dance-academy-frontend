import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private BASE = 'http://localhost:5000/api/students';

  constructor(private http: HttpClient, private auth: AuthService) { }

  getProfile() { return this.http.get(`${this.BASE}/profile`); }
  updateProfile(data: any) { return this.http.put(`${this.BASE}/profile`, data); }
  getAttendance() { return this.http.get(`${this.BASE}/attendance`); }
  getFees() { return this.http.get(`${this.BASE}/fees`); }
  getMyEvents() { return this.http.get(`${this.BASE}/events`); }
}
