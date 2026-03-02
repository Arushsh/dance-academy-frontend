import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }

  // Admin-only protection
  if (state.url.includes('admin-dashboard') && !auth.isAdmin) {
    router.navigate(['/student-dashboard']);
    return false;
  }

  return true;
};
