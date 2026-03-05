import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
    selector: 'app-admin-register',
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './admin-register.html',
    styleUrl: './admin-register.css'
})
export class AdminRegister {
    formData = {
        name: '', email: '', password: '', confirmPassword: '', phone: ''
    };
    error = ''; success = ''; loading = false;
    showPassword = false;
    showConfirmPassword = false;

    constructor(private auth: AuthService, private router: Router) { }

    onSubmit() {
        this.error = '';

        if (!this.formData.name || !this.formData.email || !this.formData.password) {
            this.error = 'Please fill all required fields.';
            return;
        }

        if (this.formData.password !== this.formData.confirmPassword) {
            this.error = 'Passwords do not match.';
            return;
        }

        this.loading = true;
        const { confirmPassword, ...data } = this.formData;

        this.auth.registerAdmin(data).subscribe({
            next: (res: any) => {
                this.success = '🎉 Admin registered successfully! Redirecting...';
                this.loading = false;
                setTimeout(() => this.router.navigate(['/admin-dashboard']), 1500);
            },
            error: (err) => {
                this.error = err.error?.message || 'Admin registration failed.';
                this.loading = false;
            }
        });
    }
}
