import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainViewComponent } from './main-view/main-view.component';
import { RouterOutletComponent } from './router-outlet/router-outlet.component';
const routes: Routes = [
  { path: '', component: RouterOutletComponent,
  children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
      path: 'home', component: MainViewComponent
    },
    {
      path: 'map', loadChildren: () => import("./map/map.module").then(m => m.MapModule)
    },
  ]
},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
