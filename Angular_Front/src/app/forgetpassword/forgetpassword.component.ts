import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.scss']
})
export class ForgetpasswordComponent implements OnInit {
  forgetPasswordForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]] // Ensure password length security
    });
  }

  onSubmit(): void {
    if (this.forgetPasswordForm.valid) {
      const { email, newPassword } = this.forgetPasswordForm.value;
      this.authService.resetPassword(email, newPassword).subscribe({
        next: (response) => {
          alert('Password has been reset successfully.');
          this.router.navigate(['/auth']); // Navigate to the authentication page
        },
        error: (error) => alert('Error resetting password: ' + error.error.message)
      });
    }
  }
  
}