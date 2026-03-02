import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class EventService {
  private BASE = 'http://localhost:5000/api/events';

  constructor(private http: HttpClient, private auth: AuthService) { }

  private get headers() {
    return new HttpHeaders({ 'Authorization': `Bearer ${this.auth.token}` });
  }

  getAll() { return this.http.get(this.BASE); }
  getById(id: string) { return this.http.get(`${this.BASE}/${id}`); }
  register(id: string) { return this.http.post(`${this.BASE}/${id}/register`, {}, { headers: this.headers }); }
}
