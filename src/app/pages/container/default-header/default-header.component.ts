import { Component } from '@angular/core';
import { Colors } from '../../color';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-default-header',
  imports: [FormsModule],
  templateUrl: './default-header.component.html',
  styleUrl: './default-header.component.css'
})
export class DefaultHeaderComponent {

 colors = Colors;
  constructor(private router: Router) {}
   logout() {
    // Optional: Clear session/local storage if you store login info
    localStorage.removeItem('userToken');  // Example
    localStorage.removeItem('userName');

    // Navigate to login page
    this.router.navigate(['/login']);
  }
}
