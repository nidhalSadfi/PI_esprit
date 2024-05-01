import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { MapPageComponent } from './dashboard/map/map-page/map-page.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';  // Ensure the path is correct
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'map', component: MapPageComponent },
  { path: 'forget-password', component: ForgetpasswordComponent },
  {
    path: 'auth',
    component: AuthComponent,
  },
  {
    path:'sign-up',
    component:SignUpComponent
  },
  {
    path: 'dashboard',
    children:[
      {
        path: '',
        loadChildren: () => import("./dashboard/dashboard.module").then(m => m.DashboardModule)
      }
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

