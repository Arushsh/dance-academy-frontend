import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private BASE = 'https://dance-academy-sdnp.onrender.com/api/admin';
  private GALLERY_BASE = 'https://dance-academy-sdnp.onrender.com/api/gallery';

  constructor(private http: HttpClient, private auth: AuthService) { }

  private get headers() {
    return new HttpHeaders({ 'Authorization': `Bearer ${this.auth.token}` });
  }

  getStats() { return this.http.get(`${this.BASE}/stats`, { headers: this.headers }); }
  getStudents() { return this.http.get(`${this.BASE}/students`, { headers: this.headers }); }
  updateStudent(id: string, data: any) { return this.http.put(`${this.BASE}/students/${id}`, data, { headers: this.headers }); }
  deleteStudent(id: string) { return this.http.delete(`${this.BASE}/students/${id}`, { headers: this.headers }); }
  createEvent(data: any) { return this.http.post(`${this.BASE}/events`, data, { headers: this.headers }); }
  updateEvent(id: string, data: any) { return this.http.put(`${this.BASE}/events/${id}`, data, { headers: this.headers }); }
  deleteEvent(id: string) { return this.http.delete(`${this.BASE}/events/${id}`, { headers: this.headers }); }
  getPayments() { return this.http.get(`${this.BASE}/payments`, { headers: this.headers }); }
  updatePayment(id: string, data: any) { return this.http.put(`${this.BASE}/payments/${id}`, data, { headers: this.headers }); }
  markAttendance(data: any) { return this.http.post(`${this.BASE}/attendance`, data, { headers: this.headers }); }
  exportStudents() { return `${this.BASE}/export/students?token=${this.auth.token}`; }

  // ── Gallery ──────────────────────────────────────────────
  getGallery() { return this.http.get<any[]>(this.GALLERY_BASE); }

  uploadGalleryMedia(files: File[]) {
    const formData = new FormData();
    files.forEach(f => formData.append('media', f));
    // Do NOT set Content-Type — let the browser set multipart boundary automatically
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.auth.token}` });
    return this.http.post<any>(`${this.GALLERY_BASE}/upload`, formData, { headers });
  }

  deleteGalleryItem(id: string) {
    return this.http.delete(`${this.GALLERY_BASE}/${id}`, { headers: this.headers });
  }
}
