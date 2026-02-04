import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'easter-eggs-flakes',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [CommonModule],
})
export class EasterEggsFlakesComponent {
  flakes = Array(60);

  @Input({ required: true }) img!: string;
}
