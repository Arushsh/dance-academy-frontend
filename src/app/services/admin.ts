import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private BASE = 'http://localhost:5000/api/admin';
  private GALLERY_BASE = 'http://localhost:5000/api/gallery';

  constructor(private http: HttpClient, private auth: AuthService) { }

  getStats() { return this.http.get(`${this.BASE}/stats`); }
  getStudents() { return this.http.get(`${this.BASE}/students`); }
  updateStudent(id: string, data: any) { return this.http.put(`${this.BASE}/students/${id}`, data); }
  deleteStudent(id: string) { return this.http.delete(`${this.BASE}/students/${id}`); }
  createEvent(data: any) { return this.http.post(`${this.BASE}/events`, data); }
  updateEvent(id: string, data: any) { return this.http.put(`${this.BASE}/events/${id}`, data); }
  deleteEvent(id: string) { return this.http.delete(`${this.BASE}/events/${id}`); }
  getPayments() { return this.http.get(`${this.BASE}/payments`); }
  updatePayment(id: string, data: any) { return this.http.put(`${this.BASE}/payments/${id}`, data); }
  markAttendance(data: any) { return this.http.post(`${this.BASE}/attendance`, data); }
  exportStudents() { return `${this.BASE}/export/students?token=${this.auth.token}`; }

  // ── Gallery ──────────────────────────────────────────────
  getGallery() { return this.http.get<any[]>(this.GALLERY_BASE); }

  uploadGalleryMedia(files: File[]) {
    const formData = new FormData();
    files.forEach(f => formData.append('media', f));
    // Interceptor will add Authorization header
    return this.http.post<any>(`${this.GALLERY_BASE}/upload`, formData);
  }

  deleteGalleryItem(id: string) {
    return this.http.delete(`${this.GALLERY_BASE}/${id}`);
  }
}
