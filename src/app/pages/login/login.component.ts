import { Component } from '@angular/core';
import { Colors } from '../color';
import { User } from '../models/common-models/user';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { userInfo } from 'node:os';
import { CommonserviceService } from '../../services/commonservice.service';
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
  users: User[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private commonService: CommonserviceService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.loadUsers();
  }

  loadUsers() {
    this.commonService.getUsers().subscribe({
      next: res => this.users = res,
      error: err => {
        console.error("❌ Error loading users:", err);
        alert("Error loading user list.");
      }
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      const matchedUser = this.users.find(u => u.userName === username && u.passwordHash === password);

      if (matchedUser) {
        alert(`Login successful  Welcome ${matchedUser.userName}`);
        this.router.navigate(['/default']);
      } else {
        this.errorMessage = 'Invalid username or password ❌';
      }
    } else {
      this.errorMessage = 'Please fill in all fields ⚠️';
    }
  }
}
