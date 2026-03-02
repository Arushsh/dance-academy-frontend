import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private BASE = 'http://localhost:5000/api/courses';
  constructor(private http: HttpClient) { }
  getAll() { return this.http.get(this.BASE); }
  getByType(type: string) { return this.http.get(`${this.BASE}/${type}`); }
}
