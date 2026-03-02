import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  _id: string; name: string; email: string; role: 'student' | 'admin';
  age?: number; gender?: string; phone?: string; address?: string;
  danceType?: string; batchTiming?: string; joiningDate?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private BASE = 'http://localhost:5000/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  private getStoredUser(): User | null {
    try { return JSON.parse(localStorage.getItem('da_user') || 'null'); } catch { return null; }
  }

  get token(): string | null { return localStorage.getItem('da_token'); }
  get currentUser(): User | null { return this.currentUserSubject.value; }
  get isLoggedIn(): boolean { return !!this.token; }
  get isAdmin(): boolean { return this.currentUser?.role === 'admin'; }
  get isStudent(): boolean { return this.currentUser?.role === 'student'; }

  register(data: any): Observable<any> {
    return this.http.post(`${this.BASE}/register`, data).pipe(
      tap((res: any) => this.storeAuth(res))
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.BASE}/login`, { email, password }).pipe(
      tap((res: any) => this.storeAuth(res))
    );
  }

  private storeAuth(res: any) {
    localStorage.setItem('da_token', res.token);
    localStorage.setItem('da_user', JSON.stringify(res.user));
    this.currentUserSubject.next(res.user);
  }

  logout() {
    localStorage.removeItem('da_token');
    localStorage.removeItem('da_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
