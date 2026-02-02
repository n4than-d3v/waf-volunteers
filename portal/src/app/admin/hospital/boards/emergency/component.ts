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
    const startSplit = start.toISOString().split('T');
    const startSplitTime = startSplit[1].split(':');
    this.startDate = startSplit[0];
    this.startTime = startSplitTime[0] + ':' + startSplitTime[1];

    const end = start.add(15, 'minutes');
    const endSplit = end.toISOString().split('T');
    const endSplitTime = endSplit[1].split(':');
    this.endDate = endSplit[0];
    this.endTime = endSplitTime[0] + ':' + endSplitTime[1];
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
    this.store.dispatch(
      addBoardMessage({
        id: -1,
        message: this.message,
        start: this.startDate + 'T' + this.startTime + 'Z',
        end: this.endDate + 'T' + this.endTime + 'Z',
        emergency: true,
      }),
    );
    this.emergencyType = '';
  }
}
