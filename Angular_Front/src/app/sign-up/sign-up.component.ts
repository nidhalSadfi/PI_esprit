import { Component, OnInit } from '@angular/core';
import { User } from '../classes/user';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginServiceService } from '../Services/login-service.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  formSign = this.formBuilder.group({
    email:"",
    password: "",
    Rpassword:""
  });

  constructor(private router: Router,private formBuilder : FormBuilder,private currentService:LoginServiceService) { }

  ngOnInit(): void {
  }
  SignUp(){
    if(this.formSign.value.password==this.formSign.value.Rpassword){
    var u= new User(this.formSign.value.email,this.formSign.value.password);
    this.currentService.SigningUp(u).subscribe(data=>{
      console.log(data);
      alert('account created');
      this.router.navigate(['/']);
    },
      error => {
        alert("Duplicated Email retry please!");
        console.log(error);});
  }
  else{
    alert("repeat password is not the same as password!!")
  }
}
}
