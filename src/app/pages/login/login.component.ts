import { Component } from '@angular/core';
import { Colors } from '../color';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,   // ✅ important for Angular 19
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule]  // ✅ use ReactiveFormsModule
})
export class LoginComponent {
  colors = Colors;
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      if (username === 'admin' && password === '123') {
        alert('Login successful ');
        this.router.navigate(['/default']);
      } else {
        this.errorMessage = 'Invalid username or password ❌';
      }
    } else {
      this.errorMessage = 'Please fill in all fields ⚠️';
    }
  }
}
