import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  activeTab: 'student' | 'admin' = 'student';
  email = ''; password = '';
  error = ''; loading = false;
  showPassword = false;


  constructor(private auth: AuthService, private router: Router) {
    if (auth.isLoggedIn) {
      this.router.navigate([auth.isAdmin ? '/admin-dashboard' : '/student-dashboard']);
    }
  }

  setTab(tab: 'student' | 'admin') {
    this.activeTab = tab;
    this.email = tab === 'admin' ? 'admin@danceacademy.com' : 'priya@example.com';
    this.password = tab === 'admin' ? 'admin123' : 'student123';
    this.error = '';
  }

  onLogin() {
    if (!this.email || !this.password) { this.error = 'Please enter email and password.'; return; }
    this.loading = true; this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.user.role === 'admin') this.router.navigate(['/admin-dashboard']);
        else this.router.navigate(['/student-dashboard']);
      },
      error: (err) => { this.error = err.error?.message || 'Login failed. Check credentials.'; this.loading = false; }
    });
  }
}
