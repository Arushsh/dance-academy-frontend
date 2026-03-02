import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  events: any[] = [];
  danceTypes = [
    { name: 'Classical Dance', icon: '🪷', color: '#ff6b35', desc: 'Bharatanatyam, Kathak & more' },
    { name: 'Bollywood', icon: '🎬', color: '#e91e8c', desc: 'Energetic film choreography' },
    { name: 'Hip-Hop', icon: '🎤', color: '#9b59ff', desc: 'Breaking, locking & freestyle' },
    { name: 'Contemporary', icon: '🌊', color: '#0891b2', desc: 'Modern fluid movement' },
  ];
  stats = [
    { value: '500+', label: 'Students Trained', icon: '👩‍🎓' },
    { value: '15+', label: 'Years of Excellence', icon: '🏆' },
    { value: '4', label: 'Dance Styles', icon: '💃' },
    { value: '50+', label: 'Events Organized', icon: '🎭' },
  ];
  galleryImages = ['🎭', '💃', '🕺', '🎵', '🌟', '✨'];

  constructor(private eventService: EventService) { }

  ngOnInit() {
    this.eventService.getAll().subscribe({
      next: (data: any) => this.events = data.slice(0, 3),
      error: () => this.events = this.getMockEvents()
    });
  }

  getMockEvents(): any[] {
    return [
      { title: 'Annual Dance Championships 2026', date: '2026-04-15', venue: 'City Auditorium, Mumbai', category: 'Competition' },
      { title: 'Spring Bollywood Blast', date: '2026-03-20', venue: 'Academy Main Hall', category: 'Performance' },
      { title: 'Hip-Hop Battle Night', date: '2026-03-28', venue: 'Urban Dance Studio', category: 'Competition' },
    ];
  }
}
