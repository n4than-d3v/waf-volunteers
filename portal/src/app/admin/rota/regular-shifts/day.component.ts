import { Component, Input, OnInit } from '@angular/core';
import { daysOfWeek } from '../state';

@Component({
  selector: 'admin-rota-regular-shift-day',
  standalone: true,
  template: `{{ name }}`,
})
export class AdminRotaRegularShiftDayComponent implements OnInit {
  name = '';

  @Input({ required: true }) day: number = -1;

  ngOnInit(): void {
    daysOfWeek.forEach((day) => {
      if (day.value === this.day) {
        this.name = day.name;
      }
    });
  }
}
