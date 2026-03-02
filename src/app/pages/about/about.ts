import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [RouterLink, CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About {
  trainers = [
    { name: 'Guru Priya Sharma', role: 'Classical Dance Instructor', exp: '15 years', icon: '🪷', styles: ['Bharatanatyam', 'Kathak', 'Odissi'] },
    { name: 'Neha Kapoor', role: 'Bollywood Dance Instructor', exp: '10 years', icon: '🎬', styles: ['Bollywood', 'Fusion', 'Semi-Classical'] },
    { name: 'Arjun Mehta', role: 'Hip-Hop Instructor', exp: '8 years', icon: '🎤', styles: ['Breaking', 'Popping', 'Freestyle'] },
    { name: 'Riya Desai', role: 'Contemporary Dance Instructor', exp: '12 years', icon: '🌊', styles: ['Contemporary', 'Lyrical', 'Jazz'] },
  ];

  milestones = [
    { year: '2010', title: 'Academy Founded', desc: 'Rhythm Dance Academy was established with a single studio and 3 dedicated trainers.' },
    { year: '2013', title: 'First Championship Win', desc: 'Our students won gold at the State Dance Championship in Classical and Bollywood categories.' },
    { year: '2016', title: 'New Studio Wing', desc: 'Expanded to a 4,000 sq ft facility with 3 professional studios and performance hall.' },
    { year: '2019', title: '300+ Students Milestone', desc: 'Crossed 300 enrolled students and introduced Contemporary and Hip-Hop courses.' },
    { year: '2022', title: 'National Recognition', desc: 'Recognized as one of the Top 10 Dance Academies in Maharashtra by the Arts Council.' },
    { year: '2024', title: '500+ Students Strong', desc: 'Celebrating 14 years of excellence with 500+ trained students across all dance forms.' },
  ];

  values = [
    { icon: '🎯', title: 'Discipline', desc: 'We believe structure and consistency are the foundation of great artistry.' },
    { icon: '💡', title: 'Creativity', desc: 'Encouraging individual expression within the framework of classical techniques.' },
    { icon: '🤝', title: 'Community', desc: 'Building a supportive family where every student thrives and inspires others.' },
    { icon: '🏆', title: 'Excellence', desc: 'Pushing boundaries to achieve the highest standards in dance performance.' },
    { icon: '💗', title: 'Passion', desc: 'Instilling a lifelong love for dance that goes beyond the studio.' },
    { icon: '🌱', title: 'Growth', desc: 'Continuous learning and improvement at every level of the journey.' },
  ];
}
