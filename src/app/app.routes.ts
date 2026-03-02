import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Courses } from './pages/courses/courses';
import { Events } from './pages/events/events';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { StudentDashboard } from './pages/student-dashboard/student-dashboard';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'about', component: About },
    { path: 'courses', component: Courses },
    { path: 'events', component: Events },
    { path: 'register', component: Register },
    { path: 'login', component: Login },
    { path: 'student-dashboard', component: StudentDashboard, canActivate: [authGuard] },
    { path: 'admin-dashboard', component: AdminDashboard, canActivate: [authGuard] },
    { path: '**', redirectTo: '' }
];
