import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import moment from 'moment';
import { addBoardMessage } from '../../actions';

@Component({
  selector: 'admin-hospital-boards-emergency',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [RouterLink, FormsModule],
})
export class AdminHospitalBoardsEmergencyComponent implements OnInit {
  constructor(private store: Store) {}

  emergencyType = '';
  message = '';
  startDate = '';
  startTime = '';
  endDate = '';
  endTime = '';

  private resetDateRange() {
    const start = moment();

    this.startDate = start.format('YYYY-MM-DD');
    this.startTime = start.format('HH:mm');

    const end = moment(start).add(15, 'minutes');
    this.endDate = end.format('YYYY-MM-DD');
    this.endTime = end.format('HH:mm');
  }

  ngOnInit(): void {
    this.resetDateRange();
  }

  updateEmergencyType() {
    if (this.emergencyType === 'Fire') {
      this.message = 'Fire! Evacuate now to the car park assembly point!';
    } else if (this.emergencyType === 'Natural disaster') {
      this.message =
        'Natural disaster! Evacuate now to the car park assembly point!';
    } else if (this.emergencyType === 'Security') {
      this.message = 'Alert! Stay where you are, lock all doors, stay alert!';
    } else if (this.emergencyType === 'Other') {
      this.message = '';
    }
  }

  addMessage() {
    const start = moment(
      `${this.startDate} ${this.startTime}`,
      'YYYY-MM-DD HH:mm',
    );
    const end = moment(`${this.endDate} ${this.endTime}`, 'YYYY-MM-DD HH:mm');

    this.store.dispatch(
      addBoardMessage({
        id: -1,
        message: this.message,
        start: start.toISOString(),
        end: end.toISOString(),
        emergency: true,
      }),
    );
    this.emergencyType = '';
  }
}
