import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Wrapper, Report } from '../state';
import { selectAdminReports } from '../selectors';
import { getReports } from '../actions';
import moment from 'moment';
import { AsyncPipe } from '@angular/common';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'admin-rota-view-attendance',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, SpinnerComponent, FormsModule, RouterLink],
})
export class AdminRotaViewAttendanceComponent implements OnInit {
  reports$: Observable<Wrapper<Report>>;

  start: string;
  end: string;

  constructor(private store: Store) {
    this.reports$ = this.store.select(selectAdminReports);
    const start = moment().startOf('isoWeek');
    const end = moment(start).add(6, 'days');
    this.start = start.format('YYYY-MM-DD');
    this.end = end.format('YYYY-MM-DD');
  }

  update() {
    this.store.dispatch(
      getReports({
        start: this.start,
        end: this.end,
      })
    );
  }

  ngOnInit() {
    this.update();
  }
}
