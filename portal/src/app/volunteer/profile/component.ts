import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
})
export class VolunteerProfileComponent {
  constructor(private store: Store) {}
}
