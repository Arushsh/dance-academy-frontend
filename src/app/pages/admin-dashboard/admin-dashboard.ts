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
  attendanceRecords: any[] = [];
  loading = false;
  successMsg = '';
  errorMsg = '';
  showAddEvent = false;
  newEvent = { title: '', description: '', date: '', venue: '', time: '', category: 'Competition', maxParticipants: 50 };

  // Gallery
  galleryItems: any[] = [];
  galleryFilter = 'All';
  gallerySections = ['All', 'General', 'Performance', 'Workshop', 'Competition', 'Festival', 'Behind the Scenes'];
  uploadSection = 'General';
  uploadTitle = '';
  uploading = false;

  // Inline student edit
  editingStudentId: string | null = null;
  editStudentData: any = {};
  studentFilter = '';

  // Attendance
  attendanceStudentId = '';
  attendanceDate = new Date().toISOString().split('T')[0];
  attendanceStatus = 'Present';
  attendanceDateFilter = '';
  attendanceStudentFilter = '';
  showAttendanceForm = false;

  // Payments — add new record
  showAddPayment = false;
  newPayment = { student: '', month: '', year: new Date().getFullYear(), amount: 1500, status: 'Pending', paymentMethod: 'Cash' };
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
    this.errorMsg = '';
    if (t === 'gallery') this.loadGallery();
    if (t === 'attendance') this.loadAttendance();
  }

  showSuccess(msg: string) {
    this.successMsg = msg;
    this.errorMsg = '';
    setTimeout(() => this.successMsg = '', 4000);
  }
  showError(msg: string) {
    this.errorMsg = msg;
    this.successMsg = '';
    setTimeout(() => this.errorMsg = '', 5000);
  }

  // ── STATS ──
  loadStats() {
    this.admin.getStats().subscribe({
      next: (d: any) => this.stats = d,
      error: () => this.stats = null
    });
  }

  // ── STUDENTS ──
  loadStudents() {
    this.admin.getStudents().subscribe({
      next: (d: any) => this.students = d,
      error: () => this.students = []
    });
  }

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
        this.showSuccess('✅ Student updated successfully!');
      },
      error: () => this.showError('❌ Update failed.')
    });
  }

  toggleStudentStatus(student: any) {
    this.admin.updateStudent(student._id, { isActive: !student.isActive }).subscribe({
      next: () => { student.isActive = !student.isActive; this.showSuccess('✅ Student status updated!'); },
      error: () => this.showError('❌ Update failed.')
    });
  }

  deleteStudent(id: string) {
    if (!confirm('Remove this student permanently?')) return;
    this.admin.deleteStudent(id).subscribe({
      next: () => { this.students = this.students.filter(s => s._id !== id); this.showSuccess('✅ Student removed.'); }
    });
  }

  // ── PAYMENTS ──
  loadPayments() {
    this.admin.getPayments().subscribe({
      next: (d: any) => this.payments = d,
      error: () => this.payments = []
    });
  }

  markPayment(payment: any, status: string) {
    this.admin.updatePayment(payment._id, { status, paymentDate: status === 'Paid' ? new Date() : null }).subscribe({
      next: () => { payment.status = status; this.showSuccess('✅ Payment updated!'); }
    });
  }

  deletePaymentRecord(id: string) {
    if (!confirm('Delete this payment record?')) return;
    this.admin.deletePayment(id).subscribe({
      next: () => { this.payments = this.payments.filter(p => p._id !== id); this.showSuccess('✅ Payment record deleted.'); }
    });
  }

  createPayment() {
    if (!this.newPayment.student) { this.showError('Please select a student.'); return; }
    if (!this.newPayment.month) { this.showError('Please select a month.'); return; }
    this.admin.createPayment(this.newPayment).subscribe({
      next: (res: any) => {
        this.payments.unshift(res.payment);
        this.showAddPayment = false;
        this.newPayment = { student: '', month: '', year: new Date().getFullYear(), amount: 1500, status: 'Pending', paymentMethod: 'Cash' };
        this.showSuccess('✅ Payment record created!');
      },
      error: (err: any) => this.showError('❌ ' + (err.error?.message || 'Failed to create payment.'))
    });
  }

  // ── EVENTS ──
  loadEvents() {
    this.eventService.getAll().subscribe({
      next: (d: any) => this.events = d,
      error: () => this.events = []
    });
  }

  createEvent() {
    this.admin.createEvent(this.newEvent).subscribe({
      next: (res: any) => {
        this.events.unshift(res.event);
        this.showAddEvent = false;
        this.newEvent = { title: '', description: '', date: '', venue: '', time: '', category: 'Competition', maxParticipants: 50 };
        this.showSuccess('✅ Event created!');
      },
      error: () => this.showError('❌ Failed to create event.')
    });
  }

  deleteEvent(id: string) {
    if (!confirm('Delete this event?')) return;
    this.admin.deleteEvent(id).subscribe({
      next: () => { this.events = this.events.filter(e => e._id !== id); this.showSuccess('✅ Event deleted.'); }
    });
  }

  // ── ATTENDANCE ──
  loadAttendance() {
    this.admin.getAttendance(
      this.attendanceStudentFilter || undefined,
      this.attendanceDateFilter || undefined
    ).subscribe({
      next: (d: any) => this.attendanceRecords = d,
      error: () => this.attendanceRecords = []
    });
  }

  markAttendance() {
    if (!this.attendanceStudentId) { this.showError('Please select a student.'); return; }
    if (!this.attendanceDate) { this.showError('Please select a date.'); return; }
    const student = this.students.find(s => s._id === this.attendanceStudentId);
    this.admin.markAttendance({
      student: this.attendanceStudentId,
      date: this.attendanceDate,
      status: this.attendanceStatus,
      danceType: student?.danceType || '',
      batchTiming: student?.batchTiming || ''
    }).subscribe({
      next: (res: any) => {
        // Upsert in local list
        const idx = this.attendanceRecords.findIndex(r => r._id === res.attendance._id);
        if (idx >= 0) this.attendanceRecords[idx] = res.attendance;
        else this.attendanceRecords.unshift(res.attendance);
        this.showSuccess('✅ Attendance marked!');
        this.showAttendanceForm = false;
      },
      error: (err: any) => this.showError('❌ ' + (err.error?.message || 'Failed to mark attendance.'))
    });
  }

  markAllAttendance(status: string) {
    // Batch mark for all students for a given date
    if (!this.attendanceDate) { this.showError('Please select a date first.'); return; }
    const promises = this.students.map(s =>
      this.admin.markAttendance({
        student: s._id,
        date: this.attendanceDate,
        status,
        danceType: s.danceType || '',
        batchTiming: s.batchTiming || ''
      }).toPromise().catch(() => null)
    );
    Promise.all(promises).then(() => {
      this.loadAttendance();
      this.showSuccess(`✅ All students marked as ${status} for ${this.attendanceDate}!`);
    });
  }

  deleteAttendance(id: string) {
    if (!confirm('Delete this attendance record?')) return;
    this.admin.deleteAttendance(id).subscribe({
      next: () => { this.attendanceRecords = this.attendanceRecords.filter(r => r._id !== id); this.showSuccess('✅ Record deleted.'); }
    });
  }

  filterAttendance() { this.loadAttendance(); }

  getStudentName(id: string): string {
    return this.students.find(s => s._id === id)?.name || '—';
  }

  // ── GALLERY ──
  loadGallery() {
    this.admin.getGallery(this.galleryFilter).subscribe({
      next: (items: any[]) => this.galleryItems = items,
      error: () => this.galleryItems = []
    });
  }

  filterGallery(section: string) {
    this.galleryFilter = section;
    this.loadGallery();
  }

  onGalleryFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    if (!files.length) return;
    this.uploading = true;
    this.successMsg = '';
    this.admin.uploadGalleryMedia(files, this.uploadSection, this.uploadTitle).subscribe({
      next: (res: any) => {
        this.galleryItems = [...(res.items || []), ...this.galleryItems];
        this.uploading = false;
        this.showSuccess(`✅ ${res.items?.length || 0} file(s) uploaded!`);
        if (input) input.value = '';
        this.uploadTitle = '';
      },
      error: (err: any) => {
        this.uploading = false;
        this.showError('❌ Upload failed: ' + (err.error?.message || err.message || 'Unknown error'));
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
        this.showSuccess('✅ Media deleted from Cloudinary.');
      },
      error: (err: any) => this.showError('❌ Delete failed: ' + (err.error?.message || 'Unknown error'))
    });
  }

  exportStudents() { window.open(this.admin.exportStudents()); }
  logout() { this.auth.logout(); }
}
