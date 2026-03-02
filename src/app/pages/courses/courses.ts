import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course';

@Component({
  selector: 'app-courses',
  imports: [RouterLink, CommonModule],
  templateUrl: './courses.html',
  styleUrl: './courses.css'
})
export class Courses implements OnInit {
  courses: any[] = [];
  selectedCourse: any = null;
  feesData = [
    { type: 'Classical', monthly: '₹1,500', registration: '₹500', annual: '₹16,000' },
    { type: 'Bollywood', monthly: '₹1,200', registration: '₹400', annual: '₹13,000' },
    { type: 'Hip-Hop', monthly: '₹1,300', registration: '₹450', annual: '₹14,000' },
    { type: 'Contemporary', monthly: '₹1,600', registration: '₹500', annual: '₹17,000' },
  ];

  constructor(private courseService: CourseService) { }

  ngOnInit() {
    this.courseService.getAll().subscribe({
      next: (data: any) => { this.courses = data; this.selectedCourse = data[0]; },
      error: () => { this.courses = this.getMockCourses(); this.selectedCourse = this.courses[0]; }
    });
  }

  selectCourse(course: any) { this.selectedCourse = course; }

  getMockCourses(): any[] {
    return [
      { id: 1, name: 'Classical Dance', type: 'Classical', emoji: '🪷', description: 'Master the grace and precision of classical Indian dance forms including Bharatanatyam and Kathak.', trainer: 'Guru Priya Sharma', experience: '15 years', level: 'Beginner to Advanced', duration: '6 months', batchTimings: ['7:00 AM - 8:00 AM', '5:00 PM - 6:00 PM', '6:00 PM - 7:00 PM'], fees: { monthly: 1500, registration: 500, annual: 16000 }, features: ['Classical Mudras', 'Rhythmic Footwork', 'Expressive Storytelling', 'Stage Performance'], color: '#ff6b35' },
      { id: 2, name: 'Bollywood Dance', type: 'Bollywood', emoji: '🎬', description: 'Learn the vibrant and energetic dance style inspired by Bollywood films. Great for all ages!', trainer: 'Neha Kapoor', experience: '10 years', level: 'Beginner to Intermediate', duration: '3 months', batchTimings: ['8:00 AM - 9:00 AM', '4:00 PM - 5:00 PM', '7:00 PM - 8:00 PM'], fees: { monthly: 1200, registration: 400, annual: 13000 }, features: ['Film Choreography', 'Group Performances', 'Expression Training', 'Stage Confidence'], color: '#e91e8c' },
      { id: 3, name: 'Hip-Hop Dance', type: 'Hip-Hop', emoji: '🎤', description: 'Dive into the world of Hip-Hop with breaking, locking, popping and freestyle movements.', trainer: 'Arjun Mehta', experience: '8 years', level: 'Beginner to Advanced', duration: '4 months', batchTimings: ['9:00 AM - 10:00 AM', '5:30 PM - 6:30 PM', '7:30 PM - 8:30 PM'], fees: { monthly: 1300, registration: 450, annual: 14000 }, features: ['Breaking & Popping', 'Freestyle Sessions', 'Battle Training', 'Music Theory'], color: '#7c3aed' },
      { id: 4, name: 'Contemporary Dance', type: 'Contemporary', emoji: '🌊', description: 'Explore fluid movements and artistic expression in contemporary dance.', trainer: 'Riya Desai', experience: '12 years', level: 'Intermediate to Advanced', duration: '5 months', batchTimings: ['6:00 AM - 7:00 AM', '6:30 PM - 7:30 PM', '8:00 PM - 9:00 PM'], fees: { monthly: 1600, registration: 500, annual: 17000 }, features: ['Floor Work', 'Improvisation', 'Choreography Skills', 'Acrobatic Elements'], color: '#0891b2' },
    ];
  }
}
