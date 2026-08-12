import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { QuarantineReason, Wrapper } from '../state';
import { Store } from '@ngrx/store';
import { selectQuarantineReasons } from '../selectors';
import {
  createQuarantineReason,
  getQuarantineReasons,
  updateQuarantineReason,
} from '../actions';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { AsyncPipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'admin-hospital-quarantine-reasons',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    RouterLink,
    AsyncPipe,
    SpinnerComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AdminHospitalQuarantineReasonsComponent implements OnInit {
  quarantineReasons$: Observable<Wrapper<QuarantineReason>>;

  creating = false;
  updating = false;
  updatingQuarantineReason: QuarantineReason | null = null;

  filter = '';

  form = new FormGroup({
    name: new FormControl(''),
    order: new FormControl(0),
  });

  constructor(
    private store: Store,
    private sanitizer: DomSanitizer,
  ) {
    this.quarantineReasons$ = this.store.select(selectQuarantineReasons);
  }

  shouldShowQuarantineReason(quarantineReason: QuarantineReason) {
    return quarantineReason.name
      .toLowerCase()
      .includes(this.filter.toLowerCase());
  }

  beginCreate() {
    this.updating = false;
    this.creating = true;
  }

  beginUpdate(quarantineReason: QuarantineReason) {
    this.creating = false;
    this.updating = true;
    this.updatingQuarantineReason = quarantineReason;
    this.form.controls.name.setValue(quarantineReason.name);
    this.form.controls.order.setValue(quarantineReason.order);
    window.scroll(0, 0);
  }

  cancel() {
    this.creating = false;
    this.updating = false;
    this.updatingQuarantineReason = null;
    this.form.reset();
  }

  create() {
    this.store.dispatch(
      createQuarantineReason({
        quarantineReason: {
          name: this.form.controls.name.value || '',
          order: this.form.controls.order.value || 0,
        },
      }),
    );
    this.cancel();
  }

  update() {
    this.store.dispatch(
      updateQuarantineReason({
        quarantineReason: {
          id: this.updatingQuarantineReason!.id,
          name: this.form.controls.name.value || '',
          order: this.form.controls.order.value || 0,
        },
      }),
    );
    this.cancel();
  }

  ngOnInit() {
    this.store.dispatch(getQuarantineReasons());
  }
}
