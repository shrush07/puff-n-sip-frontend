import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isLoggedIn(): boolean {
    const userJson = localStorage.getItem('User');
    if (!userJson) return false;
    const user = JSON.parse(userJson);
    return !!user?.id; // Logged in if user has id
  }

  login(token: string, role: 'admin' | 'user') {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
  }

  logout() {
    localStorage.clear();
  }
}
