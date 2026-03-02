import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { StudentService } from '../../services/student';

@Component({
  selector: 'app-student-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css'
})
export class StudentDashboard implements OnInit {
  activeTab = 'profile';
  user: any = null;
  attendance: any = null;
  fees: any = null;
  myEvents: any[] = [];
  loading = false;
  editMode = false;
  editData: any = {};
  successMsg = '';

  constructor(public auth: AuthService, private studentService: StudentService, private router: Router) { }

  ngOnInit() {
    this.user = this.auth.currentUser;
    this.editData = { ...this.user };
    this.loadData();
  }

  loadData() {
    this.studentService.getAttendance().subscribe({ next: (data: any) => this.attendance = data, error: () => this.attendance = this.getMockAttendance() });
    this.studentService.getFees().subscribe({ next: (data: any) => this.fees = data, error: () => this.fees = this.getMockFees() });
    this.studentService.getMyEvents().subscribe({ next: (data: any) => this.myEvents = data, error: () => this.myEvents = [] });
  }

  setTab(tab: string) { this.activeTab = tab; this.successMsg = ''; }

  saveProfile() {
    this.studentService.updateProfile(this.editData).subscribe({
      next: (res: any) => { this.user = res.user; this.editMode = false; this.successMsg = '✅ Profile updated!'; },
      error: () => { this.successMsg = '❌ Update failed.'; }
    });
  }

  logout() { this.auth.logout(); }

  get pendingFeesTotal(): number {
    if (!this.fees?.payments) return 0;
    return this.fees.payments
      .filter((p: any) => p.status !== 'Paid')
      .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
  }

  get paidFeesTotal(): number {
    if (!this.fees?.payments) return 0;
    return this.fees.payments
      .filter((p: any) => p.status === 'Paid')
      .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
  }


  getMockAttendance(): any {
    const records = Array.from({ length: 10 }, (_, i) => ({
      date: new Date(Date.now() - i * 86400000).toISOString(), status: Math.random() > 0.2 ? 'Present' : 'Absent'
    }));
    const present = records.filter(r => r.status === 'Present').length;
    return { attendance: records, stats: { total: 10, present, absent: 10 - present, percentage: present * 10 } };
  }

  getMockFees(): any {
    return {
      payments: [
        { month: 'March', year: 2026, amount: 1500, status: 'Pending', paymentMethod: 'Cash' },
        { month: 'February', year: 2026, amount: 1500, status: 'Paid', paymentDate: '2026-02-05', paymentMethod: 'UPI' },
        { month: 'January', year: 2026, amount: 1500, status: 'Paid', paymentDate: '2026-01-05', paymentMethod: 'UPI' },
      ], pendingCount: 1
    };
  }
}
