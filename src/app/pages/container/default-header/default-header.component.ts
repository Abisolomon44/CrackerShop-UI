import { Component } from '@angular/core';
import { Colors } from '../../color';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-default-header',
  imports: [FormsModule,CommonModule],
  templateUrl: './default-header.component.html',
  styleUrl: './default-header.component.css'
})
export class DefaultHeaderComponent {

 colors = Colors;
  dropdownOpen = false;

  constructor(private router: Router) {}

  getCurrentUserId(): number {
    const userId = localStorage.getItem('userId');
    return userId ? Number(userId) : 0;
  }

  getCurrentUserName(): string {
    return localStorage.getItem('userName') || 'Guest';
  }

  getCurrentUserRole(): string {
    return localStorage.getItem('role') || 'User';
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('userId');
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
    this.dropdownOpen = false;
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
    this.dropdownOpen = false;
  }

}
