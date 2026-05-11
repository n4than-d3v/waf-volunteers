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

    this.startDate = start.format('YYYY-MM-DD');
    this.startTime = start.format('HH:mm');

    const end = moment(start).add(30, 'minutes');
    this.endDate = end.format('YYYY-MM-DD');
    this.endTime = end.format('HH:mm');
  }

  constructor(private store: Store) {
    this.boards$ = this.store.select(selectBoards);
    this.boardMessages$ = this.store.select(selectBoardMessages);
    this.resetDateRange();
  }

  addMessage() {
    const start = moment(
      `${this.startDate} ${this.startTime}`,
      'YYYY-MM-DD HH:mm',
    );
    const end = moment(`${this.endDate} ${this.endTime}`, 'YYYY-MM-DD HH:mm');

    this.store.dispatch(
      addBoardMessage({
        id: Number(this.boardId),
        message: this.message,
        start: start.toISOString(),
        end: end.toISOString(),
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
