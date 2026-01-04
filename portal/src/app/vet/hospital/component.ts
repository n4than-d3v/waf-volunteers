import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'vet-hospital',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [RouterLink],
})
export class VetHospitalComponent {}
