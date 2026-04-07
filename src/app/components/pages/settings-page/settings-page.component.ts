import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.css'],
})
export class SettingsPageComponent implements OnInit {
  settingsForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.settingsForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      phone: [''],
      password: [''], 
    });

    // Load current user info
    this.userService.getUserProfile().subscribe((user) => {
      this.settingsForm.patchValue({
        name: user.name,
        email: user.email,
        address: user.address,
        phone: user.phone
      });
    });
  }

  updateSettings() {
  if (this.settingsForm.invalid) return;

  this.userService.updateUserProfile(this.settingsForm.value).subscribe({
    next: () => {
      this.toastr.success('Profile updated successfully');
    },
    error: () => {
      this.toastr.error('Failed to update profile');
    }
  });
}

}