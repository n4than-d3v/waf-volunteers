import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { addBoardMessage, getBoardMessages, getBoards } from '../actions';
import { Observable } from 'rxjs';
import { PatientBoard, PatientBoardMessage, Wrapper } from '../state';
import { selectBoardMessages, selectBoards } from '../selectors';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../../shared/spinner/component';
import moment from 'moment';
import { AdminHospitalBoardsEmergencyComponent } from '../boards/emergency/component';

@Component({
  selector: 'admin-hospital-board-messages',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    DatePipe,
    SpinnerComponent,
    RouterLink,
    FormsModule,
    AdminHospitalBoardsEmergencyComponent,
  ],
})
export class AdminHospitalBoardMessagesComponent implements OnInit {
  boards$: Observable<Wrapper<PatientBoard>>;
  boardMessages$: Observable<Wrapper<PatientBoardMessage>>;

  adding = false;
  editing: number | null = null;

  boardId = '';
  message = '';
  startDate = '';
  startTime = '';
  endDate = '';
  endTime = '';

  emergency = false;

  private resetDateRange() {
    const start = moment();
    const startSplit = start.toISOString().split('T');
    const startSplitTime = startSplit[1].split(':');
    this.startDate = startSplit[0];
    this.startTime = startSplitTime[0] + ':' + startSplitTime[1];

    const end = start.add(30, 'minutes');
    const endSplit = end.toISOString().split('T');
    const endSplitTime = endSplit[1].split(':');
    this.endDate = endSplit[0];
    this.endTime = endSplitTime[0] + ':' + endSplitTime[1];
  }

  constructor(private store: Store) {
    this.boards$ = this.store.select(selectBoards);
    this.boardMessages$ = this.store.select(selectBoardMessages);
    this.resetDateRange();
  }

  addMessage() {
    this.store.dispatch(
      addBoardMessage({
        id: Number(this.boardId),
        message: this.message,
        start: this.startDate + 'T' + this.startTime + 'Z',
        end: this.endDate + 'T' + this.endTime + 'Z',
        emergency: false,
      }),
    );
    this.cancel();
  }

  cancel() {
    this.adding = false;
    this.editing = null;
    this.boardId = '';
    this.message = '';
    this.emergency = false;
    this.resetDateRange();
  }

  ngOnInit() {
    this.store.dispatch(getBoards());
    this.store.dispatch(getBoardMessages());
  }
}
