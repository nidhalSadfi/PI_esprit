import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginServiceService } from '../Services/login-service.service';
import { User } from '../classes/user';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  formLogin = this.formBuilder.group({
    email:"",
    password: ""
  });

  constructor(private router: Router,private formBuilder : FormBuilder,private currentService:LoginServiceService) { }

  ngOnInit(): void {
  }

  ToDashboard(){
    var u= new User(this.formLogin.value.email,this.formLogin.value.password);
    this.currentService.logging_in(u).subscribe(data=>{
      console.log(data);
       this.router.navigate(['dashboard']);
    },
      error => {
        alert("Password or Email is wrong!")
        console.log(error);});
  }
  SignUp(){
    this.router.navigate(['sign-up']);
  }
}
