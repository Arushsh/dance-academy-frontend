import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  formData = {
    name: '', email: '', password: '', confirmPassword: '',
    age: '', gender: '', phone: '', address: '',
    danceType: '', batchTiming: '',
  };
  error = ''; success = ''; loading = false;
  step = 1;
  totalSteps = 3;
  showPassword = false;
  showConfirmPassword = false;


  batchOptions: any = {
    Classical: ['7:00 AM - 8:00 AM', '5:00 PM - 6:00 PM', '6:00 PM - 7:00 PM'],
    Bollywood: ['8:00 AM - 9:00 AM', '4:00 PM - 5:00 PM', '7:00 PM - 8:00 PM'],
    'Hip-Hop': ['9:00 AM - 10:00 AM', '5:30 PM - 6:30 PM', '7:30 PM - 8:30 PM'],
    Contemporary: ['6:00 AM - 7:00 AM', '6:30 PM - 7:30 PM', '8:00 PM - 9:00 PM'],
  };

  get batchTimings() { return this.batchOptions[this.formData.danceType] || []; }

  constructor(private auth: AuthService, private router: Router) { }

  nextStep() {
    this.error = '';
    if (this.step === 1 && (!this.formData.name || !this.formData.email || !this.formData.password)) {
      this.error = 'Please fill all required fields.'; return;
    }
    if (this.step === 1 && this.formData.password !== this.formData.confirmPassword) {
      this.error = 'Passwords do not match.'; return;
    }
    if (this.step < this.totalSteps) this.step++;
  }
  prevStep() { if (this.step > 1) this.step--; }

  onDanceTypeChange() { this.formData.batchTiming = ''; }

  onSubmit() {
    if (!this.formData.danceType || !this.formData.batchTiming) { this.error = 'Please select dance type and batch timing.'; return; }
    this.loading = true; this.error = '';
    const { confirmPassword, ...data } = this.formData;
    this.auth.register(data).subscribe({
      next: (res: any) => {
        this.success = '🎉 Registered successfully! Redirecting...';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/student-dashboard']), 1500);
      },
      error: (err) => { this.error = err.error?.message || 'Registration failed.'; this.loading = false; }
    });
  }
}
