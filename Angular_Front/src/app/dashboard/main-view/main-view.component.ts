import { Component, OnInit, OnDestroy } from '@angular/core';
import { GasService } from 'src/app/gas.service';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit, OnDestroy {
  gases: any[] = [];
  private subscription: Subscription;

  constructor(private gasService: GasService, private router: Router) { }

  ngOnInit(): void {
    this.loadGasData();

    this.subscription = interval(30000).subscribe(() => {
      this.loadGasData();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadGasData(): void {
    this.gasService.getGasData().subscribe(data => {
      this.gases = data;
    });
  }

  goToMap(gas: any): void {
    this.router.navigate(['/dashboard/map'], {
      queryParams: { lat: gas.location.lat, lng: gas.location.lng, concentration: gas.concentration }
    });
  }
}
