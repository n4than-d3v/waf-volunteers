import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Rota, Shift } from './state';
import {
  selectConfirmedShift,
  selectConfirmingShift,
  selectDeniedShift,
  selectDenyingShift,
  selectRota,
  selectRotaError,
  selectRotaLoading,
} from './selectors';
import { AsyncPipe, DatePipe } from '@angular/common';
import { SpinnerComponent } from '../../shared/spinner/component';
import { confirmShift, denyShift, getRota } from './actions';
import { AdminRotaRegularShiftDayComponent } from '../../admin/rota/regular-shifts/day.component';
import { DayPipe } from './day.pipe';
import { MissingReason } from '../../admin/rota/state';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'volunteer-rota',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    SpinnerComponent,
    AdminRotaRegularShiftDayComponent,
    DatePipe,
    DayPipe,
    FormsModule,
  ],
})
export class VolunteerRotaComponent implements OnInit {
  rota$: Observable<Rota>;

  loading$: Observable<boolean>;
  error$: Observable<boolean>;

  confirming$: Observable<boolean>;
  confirmed$: Observable<boolean>;

  denying$: Observable<boolean>;
  denied$: Observable<boolean>;

  needToChange: Shift | null = null;

  askingWhyDenying: Shift | null = null;
  missingReasonId = -1;
  customMissingReason = '';

  constructor(private store: Store) {
    this.rota$ = this.store.select(selectRota);

    this.loading$ = this.store.select(selectRotaLoading);
    this.error$ = this.store.select(selectRotaError);

    this.confirming$ = this.store.select(selectConfirmingShift);
    this.confirmed$ = this.store.select(selectConfirmedShift);

    this.denying$ = this.store.select(selectDenyingShift);
    this.denied$ = this.store.select(selectDeniedShift);
  }

  confirm(shift: Shift) {
    this.store.dispatch(
      confirmShift({
        date: shift.date,
        timeId: shift.time.id!,
        jobId: shift.job.id!,
      })
    );
  }

  deny() {
    this.store.dispatch(
      denyShift({
        date: this.askingWhyDenying!.date,
        timeId: this.askingWhyDenying!.time.id!,
        jobId: this.askingWhyDenying!.job.id!,
        missingReasonId: this.missingReasonId!,
        customMissingReason: this.customMissingReason,
      })
    );
    this.askingWhyDenying = null;
    this.missingReasonId = -1;
    this.customMissingReason = '';
  }

  ngOnInit() {
    this.store.dispatch(getRota());
  }
}
