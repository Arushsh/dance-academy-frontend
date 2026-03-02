import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  isScrolled = false;
  isMobileMenuOpen = false;
  currentUser: any = null;

  constructor(public auth: AuthService) { }

  ngOnInit() {
    this.auth.currentUser$.subscribe(user => this.currentUser = user);
  }

  @HostListener('window:scroll')
  onScroll() { this.isScrolled = window.scrollY > 20; }

  toggleMobile() { this.isMobileMenuOpen = !this.isMobileMenuOpen; }
  closeMobile() { this.isMobileMenuOpen = false; }
  logout() { this.auth.logout(); this.closeMobile(); }
}
