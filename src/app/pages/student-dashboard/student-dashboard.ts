import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { StudentService } from '../../services/student';
import { GalleryService } from '../../services/gallery';

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
  galleryItems: any[] = [];
  galleryFilter = 'All';
  gallerySections = ['All', 'General', 'Performance', 'Workshop', 'Competition', 'Festival', 'Behind the Scenes'];
  loadingProfile = true;
  loadingAttendance = true;
  loadingFees = true;
  loadingEvents = true;
  loadingGallery = false;
  editMode = false;
  editData: any = {};
  successMsg = '';
  lightboxItem: any = null;

  constructor(
    public auth: AuthService,
    private studentService: StudentService,
    private galleryService: GalleryService,
    private router: Router
  ) { }

  ngOnInit() {
    this.user = this.auth.currentUser;
    this.editData = { ...this.user };
    this.loadProfile();
    this.loadAttendance();
    this.loadFees();
    this.loadEvents();
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.successMsg = '';
    if (tab === 'gallery' && this.galleryItems.length === 0) this.loadGallery();
  }

  loadProfile() {
    this.loadingProfile = true;
    this.studentService.getProfile().subscribe({
      next: (u: any) => {
        this.user = u;
        this.editData = { ...u };
        this.loadingProfile = false;
      },
      error: () => {
        this.user = this.auth.currentUser;
        this.editData = { ...this.user };
        this.loadingProfile = false;
      }
    });
  }

  loadAttendance() {
    this.loadingAttendance = true;
    this.studentService.getAttendance().subscribe({
      next: (data: any) => { this.attendance = data; this.loadingAttendance = false; },
      error: () => { this.attendance = null; this.loadingAttendance = false; }
    });
  }

  loadFees() {
    this.loadingFees = true;
    this.studentService.getFees().subscribe({
      next: (data: any) => { this.fees = data; this.loadingFees = false; },
      error: () => { this.fees = null; this.loadingFees = false; }
    });
  }

  loadEvents() {
    this.loadingEvents = true;
    this.studentService.getMyEvents().subscribe({
      next: (data: any) => { this.myEvents = data; this.loadingEvents = false; },
      error: () => { this.myEvents = []; this.loadingEvents = false; }
    });
  }

  loadGallery(section?: string) {
    this.loadingGallery = true;
    this.galleryService.getAll(section).subscribe({
      next: (items: any[]) => { this.galleryItems = items; this.loadingGallery = false; },
      error: () => { this.galleryItems = []; this.loadingGallery = false; }
    });
  }

  filterGallery(section: string) {
    this.galleryFilter = section;
    this.loadGallery(section);
  }

  saveProfile() {
    this.studentService.updateProfile(this.editData).subscribe({
      next: (res: any) => {
        this.user = res.user;
        this.editMode = false;
        this.successMsg = '✅ Profile updated!';
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => { this.successMsg = '❌ Update failed.'; }
    });
  }

  downloadItem(item: any) {
    const a = document.createElement('a');
    a.href = item.secureUrl || item.url;
    a.download = item.title || item.name || 'media';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  openLightbox(item: any) { this.lightboxItem = item; }
  closeLightbox() { this.lightboxItem = null; }

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
}
