import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  createPayment(data: any) { return this.http.post(`${this.BASE}/payments`, data); }
  updatePayment(id: string, data: any) { return this.http.put(`${this.BASE}/payments/${id}`, data); }
  deletePayment(id: string) { return this.http.delete(`${this.BASE}/payments/${id}`); }

  getAttendance(studentId?: string, date?: string) {
    let url = `${this.BASE}/attendance`;
    const params: string[] = [];
    if (studentId) params.push(`studentId=${studentId}`);
    if (date) params.push(`date=${date}`);
    if (params.length) url += '?' + params.join('&');
    return this.http.get<any[]>(url);
  }
  markAttendance(data: any) { return this.http.post(`${this.BASE}/attendance`, data); }
  deleteAttendance(id: string) { return this.http.delete(`${this.BASE}/attendance/${id}`); }

  exportStudents() { return `${this.BASE}/export/students?token=${this.auth.token}`; }

  // ── Gallery ──────────────────────────────────────────────
  getGallery(section?: string) {
    const url = section && section !== 'All' ? `${this.GALLERY_BASE}?section=${encodeURIComponent(section)}` : this.GALLERY_BASE;
    return this.http.get<any[]>(url);
  }

  uploadGalleryMedia(files: File[], section: string = 'General', title: string = '') {
    const formData = new FormData();
    files.forEach(f => formData.append('media', f));
    formData.append('section', section);
    if (title) formData.append('title', title);
    return this.http.post<any>(`${this.GALLERY_BASE}/upload`, formData);
  }

  deleteGalleryItem(id: string) {
    return this.http.delete(`${this.GALLERY_BASE}/${id}`);
  }
}
