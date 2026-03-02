import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventService } from '../../services/event';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-events',
  imports: [CommonModule, RouterLink],
  templateUrl: './events.html',
  styleUrl: './events.css'
})
export class Events implements OnInit {
  events: any[] = [];
  selectedEvent: any = null;
  registerMessage = '';
  registerError = '';
  loading = false;

  constructor(private eventService: EventService, public auth: AuthService) { }

  ngOnInit() {
    this.eventService.getAll().subscribe({
      next: (data: any) => this.events = data,
      error: () => this.events = this.getMockEvents()
    });
  }

  openEventDetail(event: any) { this.selectedEvent = event; this.registerMessage = ''; this.registerError = ''; }
  closeModal() { this.selectedEvent = null; }

  registerForEvent(eventId: string) {
    if (!this.auth.isLoggedIn) { this.registerError = 'Please login first to register for events.'; return; }
    this.loading = true;
    this.eventService.register(eventId).subscribe({
      next: () => { this.registerMessage = '✅ Successfully registered!'; this.loading = false; },
      error: (err) => { this.registerError = err.error?.message || 'Registration failed. Please try again.'; this.loading = false; }
    });
  }

  getMockEvents(): any[] {
    return [
      { _id: '1', title: 'Annual Dance Championships 2026', description: 'Our biggest annual dance championship featuring all styles. Open to all students!', date: '2026-04-15', venue: 'City Auditorium, Mumbai', time: '5:00 PM', category: 'Competition', maxParticipants: 200, registrations: [] },
      { _id: '2', title: 'Spring Bollywood Blast', description: 'A vibrant Bollywood-themed dance extravaganza celebrating spring.', date: '2026-03-20', venue: 'Academy Main Hall', time: '6:30 PM', category: 'Performance', maxParticipants: 100, registrations: [] },
      { _id: '3', title: 'Hip-Hop Battle Night', description: 'Freestyle and organized battle rounds for Hip-Hop dancers.', date: '2026-03-28', venue: 'Urban Dance Studio', time: '7:00 PM', category: 'Competition', maxParticipants: 60, registrations: [] },
      { _id: '4', title: 'Classical Dance Workshop', description: 'Intensive 2-day workshop with advanced Bharatanatyam techniques by a guest guru.', date: '2026-04-05', venue: 'Academy Studio A', time: '9:00 AM', category: 'Workshop', maxParticipants: 30, registrations: [] },
    ];
  }

  getCategoryColor(cat: string): string {
    const map: any = { Competition: 'badge-purple', Performance: 'badge-gold', Workshop: 'badge-blue', Festival: 'badge-green' };
    return map[cat] || 'badge-purple';
  }
}
