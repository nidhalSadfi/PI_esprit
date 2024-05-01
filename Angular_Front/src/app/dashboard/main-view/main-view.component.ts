import { Component, OnInit } from '@angular/core';
import { GasService } from 'src/app/gas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit {
  gases: any[] = [];

  constructor(private gasService: GasService, private router: Router) { }

  ngOnInit(): void {
    this.loadGasData();
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
