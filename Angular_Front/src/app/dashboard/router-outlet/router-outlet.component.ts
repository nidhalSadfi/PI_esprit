import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from 'src/app/Services/login-service.service';

@Component({
  selector: 'app-router-outlet',
  templateUrl: './router-outlet.component.html',
  styleUrls: ['./router-outlet.component.scss']
})
export class RouterOutletComponent implements OnInit {
  isAdmin: boolean = false;

  // Inject the LoginServiceService
  constructor(private loginService: LoginServiceService) { }

  ngOnInit(): void {
    this.checkIfAdmin();
  }

  checkIfAdmin(): void {
    this.isAdmin = this.loginService.isAdmin();  // This will now work as loginService is properly injected
  }
}
