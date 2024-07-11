import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GasService } from 'src/app/gas.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss']
})
export class MapPageComponent implements AfterViewInit {
  private map: any;
  private circles: L.Circle[] = [];

  constructor(private route: ActivatedRoute, private gasService: GasService) { }

  private initMap(): void {
    this.map = L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 3
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe(params => {
      const lat = +params['lat'];
      const lng = +params['lng'];
      const concentration = +params['concentration'];

      this.initMap();

      this.gasService.getGasData().subscribe(data => {
        data.forEach(gas => {
          const color = this.getColor(gas.concentration);
          const circle = L.circle([gas.location.lat, gas.location.lng], {
            color,
            fillColor: color,
            fillOpacity: 0.5,
            radius: this.getRadius(gas.concentration)
          }).addTo(this.map)
            .bindPopup(`<b>${gas.gasType}</b><br>Concentration: ${gas.concentration}`);
          this.circles.push(circle);
        });

        // Highlight the selected gas if coordinates are provided
        if (lat && lng) {
          this.zoomToGas(lat, lng);
        }
      });
    });
  }

  private zoomToGas(lat: number, lng: number): void {
    const circle = this.circles.find(c => {
      const { lat: cLat, lng: cLng } = c.getLatLng();
      return lat === cLat && lng === cLng;
    });

    if (circle) {
      this.map.setView([lat, lng], 13); // Adjust zoom level as needed
      circle.setStyle({ fillColor: '#0000ff', color: '#0000ff' }); // Highlight color
      circle.openPopup(); // Optionally open popup for selected gas
    }
  }

  private getColor(concentration: number): string {
    if (concentration > 0.75) {
      return '#ff0000'; // High concentration (Red)
    } else if (concentration > 0.5) {
      return '#ffa500'; // Medium concentration (Orange)
    } else {
      return '#00ff00'; // Low concentration (Green)
    }
  }

  private getRadius(concentration: number): number {
    return concentration * 500; // Adjust the multiplier to suit your needs and prevent overlapping
  }
}
