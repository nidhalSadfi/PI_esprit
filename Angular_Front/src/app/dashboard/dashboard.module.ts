import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MainViewComponent } from './main-view/main-view.component';
import { RouterOutletComponent } from './router-outlet/router-outlet.component';


@NgModule({
  declarations: [
    MainViewComponent,
    RouterOutletComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
