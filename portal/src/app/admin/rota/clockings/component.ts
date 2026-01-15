import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import moment from 'moment';
import { AsyncPipe } from '@angular/common';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  selectClockingError,
  selectClockingLoading,
  selectClockingRota,
} from '../../../clocking/selectors';
import { ClockingRota, Volunteer } from '../../../clocking/state';
import { getClockingRota } from '../../../clocking/actions';

@Component({
  selector: 'admin-rota-view-clockings',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, SpinnerComponent, FormsModule, RouterLink],
})
export class AdminRotaViewClockingsComponent implements OnInit {
  rota$: Observable<ClockingRota[]>;
  loading$: Observable<boolean>;
  error$: Observable<boolean>;

  date: string;
  isHistorical = false;

  constructor(private store: Store) {
    this.rota$ = this.store.select(selectClockingRota);
    this.loading$ = this.store.select(selectClockingLoading);
    this.error$ = this.store.select(selectClockingError);
    const date = moment();
    this.date = date.format('YYYY-MM-DD');
  }

  getTrackingKey(volunteer: Volunteer) {
    if (volunteer.attendanceId) return 'A' + volunteer.attendanceId;
    if (volunteer.visitorId) return 'V' + volunteer.visitorId;
    return volunteer.fullName;
  }

  isAnyoneSupposedToCome(shift: ClockingRota) {
    return shift.volunteers.some((x) => x.confirmed);
  }

  update() {
    this.isHistorical = moment(this.date, 'YYYY-MM-DD').isBefore(
      moment(),
      'day'
    );
    this.store.dispatch(
      getClockingRota({
        date: this.date,
      })
    );
  }

  ngOnInit() {
    this.update();
  }
}
