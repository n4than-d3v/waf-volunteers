import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getRecheckRoles, ListRecheck, ReadOnlyWrapper } from '../state';
import { selectListRechecks } from '../selectors';
import { listRechecks, performRecheck, setTab } from '../actions';
import { SpinnerComponent } from '../../shared/spinner/component';

@Component({
  selector: 'hospital-list-rechecks',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    DatePipe,
    SpinnerComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class HospitalListRechecks implements OnInit {
  date: string = '';
  viewingDate: string = '';

  listRechecks$: Observable<ReadOnlyWrapper<ListRecheck[]>>;

  comments: any = {};

  constructor(private store: Store) {
    this.listRechecks$ = this.store.select(selectListRechecks);
  }

  getRecheckRoles = getRecheckRoles;

  viewPatient(recheck: ListRecheck) {
    this.store.dispatch(
      setTab({
        tab: {
          code: 'VIEW_PATIENT',
          title: `[${recheck.reference}] ${recheck.species.name}`,
          id: recheck.viewPatientId,
        },
      })
    );
  }

  view() {
    this.viewingDate = this.date;
    this.store.dispatch(
      listRechecks({
        date: this.date,
      })
    );
  }

  perform(recheck: ListRecheck) {
    this.store.dispatch(
      performRecheck({
        recheckId: recheck.id,
        date: this.viewingDate,
        comments: this.comments[recheck.id],
      })
    );
  }

  ngOnInit() {
    this.date = new Date().toISOString().split('T')[0];
    this.view();
  }
}
