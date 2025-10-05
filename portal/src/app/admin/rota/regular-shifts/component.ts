import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addRegularShift,
  deleteRegularShift,
  getJobs,
  getRegularShifts,
  getTimes,
} from '../actions';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { daysOfWeek, Job, RegularShift, Time, Wrapper } from '../state';
import { selectJobs, selectRegularShifts, selectTimes } from '../selectors';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminRotaRegularShiftDayComponent } from './day.component';

@Component({
  selector: 'admin-rota-regular-shifts',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    SpinnerComponent,
    FormsModule,
    AdminRotaRegularShiftDayComponent,
  ],
})
export class AdminUsersUpdateRegularShiftsComponent implements OnInit {
  userId: number = 0;
  daysOfWeek = daysOfWeek;

  newRegularShiftDay = -1;
  newRegularShiftTimeId = -1;
  newRegularShiftJobId = -1;

  regularShifts$: Observable<Wrapper<RegularShift>>;
  jobs$: Observable<Wrapper<Job>>;
  times$: Observable<Wrapper<Time>>;

  constructor(private store: Store, private route: ActivatedRoute) {
    this.regularShifts$ = this.store.select(selectRegularShifts);
    this.jobs$ = this.store.select(selectJobs);
    this.times$ = this.store.select(selectTimes);
  }

  deleteRegularShift(regularShiftId: number) {
    this.store.dispatch(
      deleteRegularShift({ userId: this.userId, regularShiftId })
    );
  }

  addRegularShift() {
    this.store.dispatch(
      addRegularShift({
        userId: this.userId,
        regularShift: {
          day: Number(this.newRegularShiftDay),
          timeId: Number(this.newRegularShiftTimeId),
          jobId: Number(this.newRegularShiftJobId),

          // Unused properties
          job: { id: 0, name: '' },
          time: { id: 0, name: '', start: '', end: '' },
          id: -1,
        },
      })
    );
    this.newRegularShiftDay = -1;
    this.newRegularShiftTimeId = -1;
    this.newRegularShiftJobId = -1;
  }

  ngOnInit() {
    this.userId = this.route.snapshot.params['userId'];
    this.store.dispatch(getJobs());
    this.store.dispatch(getTimes());
    this.store.dispatch(getRegularShifts({ userId: this.userId }));
  }
}
