import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { AdminService } from '../../services/admin';
import { EventService } from '../../services/event';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  activeTab = 'stats';
  stats: any = null;
  students: any[] = [];
  payments: any[] = [];
  events: any[] = [];
  loading = false;
  successMsg = '';
  showAddEvent = false;
  newEvent = { title: '', description: '', date: '', venue: '', time: '', category: 'Competition', maxParticipants: 50 };

  // Gallery — Cloudinary backed
  galleryItems: any[] = [];
  uploading = false;

  // Inline student edit
  editingStudentId: string | null = null;
  editStudentData: any = {};
  studentFilter = '';


  constructor(public auth: AuthService, private admin: AdminService, private eventService: EventService) { }

  ngOnInit() {
    this.loadStats();
    this.loadStudents();
    this.loadPayments();
    this.loadEvents();
  }

  setTab(t: string) {
    this.activeTab = t;
    this.successMsg = '';
    if (t === 'gallery') this.loadGallery();
  }


  loadStats() {
    this.admin.getStats().subscribe({ next: (d: any) => this.stats = d, error: () => this.stats = { totalStudents: 4, activeStudents: 4, totalEvents: 4, upcomingEvents: 3, pendingPayments: 4, paidThisMonth: 12, danceTypeStats: [{ _id: 'Classical', count: 1 }, { _id: 'Bollywood', count: 1 }, { _id: 'Hip-Hop', count: 1 }, { _id: 'Contemporary', count: 1 }] } });
  }
  loadStudents() { this.admin.getStudents().subscribe({ next: (d: any) => this.students = d, error: () => this.students = [] }); }
  loadPayments() { this.admin.getPayments().subscribe({ next: (d: any) => this.payments = d, error: () => this.payments = [] }); }
  loadEvents() { this.eventService.getAll().subscribe({ next: (d: any) => this.events = d, error: () => this.events = [] }); }

  toggleStudentStatus(student: any) {
    this.admin.updateStudent(student._id, { isActive: !student.isActive }).subscribe({
      next: (res: any) => { student.isActive = !student.isActive; this.successMsg = '✅ Student updated!'; },
      error: () => { this.successMsg = '❌ Update failed.'; }
    });
  }

  deleteStudent(id: string) {
    if (!confirm('Remove this student?')) return;
    this.admin.deleteStudent(id).subscribe({ next: () => { this.students = this.students.filter(s => s._id !== id); this.successMsg = '✅ Student removed.'; } });
  }

  markPayment(payment: any, status: string) {
    this.admin.updatePayment(payment._id, { status, paymentDate: status === 'Paid' ? new Date() : null }).subscribe({
      next: () => { payment.status = status; this.successMsg = '✅ Payment updated!'; }
    });
  }

  createEvent() {
    this.admin.createEvent(this.newEvent).subscribe({
      next: (res: any) => { this.events.unshift(res.event); this.showAddEvent = false; this.newEvent = { title: '', description: '', date: '', venue: '', time: '', category: 'Competition', maxParticipants: 50 }; this.successMsg = '✅ Event created!'; },
      error: () => this.successMsg = '❌ Failed to create event.'
    });
  }

  deleteEvent(id: string) {
    if (!confirm('Delete this event?')) return;
    this.admin.deleteEvent(id).subscribe({ next: () => { this.events = this.events.filter(e => e._id !== id); this.successMsg = '✅ Event deleted.'; } });
  }

  exportStudents() { window.open(this.admin.exportStudents()); }
  logout() { this.auth.logout(); }

  // Gallery methods — Cloudinary backed
  loadGallery() {
    this.admin.getGallery().subscribe({
      next: (items: any[]) => this.galleryItems = items,
      error: () => this.galleryItems = []
    });
  }

  onGalleryFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    if (!files.length) return;
    this.uploading = true;
    this.successMsg = '';
    this.admin.uploadGalleryMedia(files).subscribe({
      next: (res: any) => {
        this.galleryItems = [...(res.items || []), ...this.galleryItems];
        this.uploading = false;
        this.successMsg = `✅ ${res.items?.length || 0} file(s) uploaded to Cloudinary!`;
        if (input) input.value = '';
      },
      error: (err: any) => {
        this.uploading = false;
        this.successMsg = '❌ Upload failed: ' + (err.error?.message || err.message || 'Unknown error');
      }
    });
  }

  onDragOver(event: DragEvent) { event.preventDefault(); }
  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (!files || !files.length) return;
    const fakeEvent = { target: { files } } as any;
    this.onGalleryFilesSelected(fakeEvent);
  }

  removeGalleryItem(item: any) {
    if (!confirm(`Delete "${item.name}" from Cloudinary gallery?`)) return;
    this.admin.deleteGalleryItem(item._id).subscribe({
      next: () => {
        this.galleryItems = this.galleryItems.filter(g => g._id !== item._id);
        this.successMsg = '✅ Media deleted from Cloudinary.';
      },
      error: (err: any) => {
        this.successMsg = '❌ Delete failed: ' + (err.error?.message || 'Unknown error');
      }
    });
  }

  // Inline student edit
  get filteredStudents() {
    if (!this.studentFilter) return this.students;
    const q = this.studentFilter.toLowerCase();
    return this.students.filter(s =>
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.danceType?.toLowerCase().includes(q)
    );
  }

  startEditStudent(student: any) {
    this.editingStudentId = student._id;
    this.editStudentData = { name: student.name, phone: student.phone, danceType: student.danceType, batchTiming: student.batchTiming, isActive: student.isActive };
  }

  cancelEditStudent() { this.editingStudentId = null; this.editStudentData = {}; }

  saveEditStudent(student: any) {
    this.admin.updateStudent(student._id, this.editStudentData).subscribe({
      next: () => {
        Object.assign(student, this.editStudentData);
        this.editingStudentId = null;
        this.successMsg = '✅ Student updated successfully!';
      },
      error: () => { this.successMsg = '❌ Update failed.'; }
    });
  }
}
