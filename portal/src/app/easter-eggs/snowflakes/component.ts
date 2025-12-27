import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'easter-eggs-snowflakes',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [CommonModule],
})
export class EasterEggsSnowflakesComponent {
  flakes = Array(60);
}
