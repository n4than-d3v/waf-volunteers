import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { CustomDailyTask, Wrapper } from '../state';
import { Store } from '@ngrx/store';
import { selectCustomDailyTasks } from '../selectors';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { AsyncPipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  createCustomDailyTask,
  getCustomDailyTasks,
  updateCustomDailyTask,
} from '../actions';

@Component({
  selector: 'admin-hospital-custom-tasks',
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
export class AdminHospitalCustomTasksComponent implements OnInit {
  customTasks$: Observable<Wrapper<CustomDailyTask>>;

  creating = false;
  updating = false;
  updatingCustomTask: CustomDailyTask | null = null;

  form = new FormGroup({
    location: new FormControl(''),
    message: new FormControl(''),
  });

  constructor(private store: Store) {
    this.customTasks$ = this.store.select(selectCustomDailyTasks);
  }

  beginCreate() {
    this.updating = false;
    this.creating = true;
  }

  beginUpdate(customTask: CustomDailyTask) {
    this.creating = false;
    this.updating = true;
    this.updatingCustomTask = customTask;
    this.form.controls.location.setValue(customTask.location);
    this.form.controls.message.setValue(customTask.message);
    window.scroll(0, 0);
  }

  cancel() {
    this.creating = false;
    this.updating = false;
    this.updatingCustomTask = null;
    this.form.reset();
  }

  create() {
    this.store.dispatch(
      createCustomDailyTask({
        customDailyTask: {
          location: this.form.controls.location.value || '',
          message: this.form.controls.message.value || '',
        },
      }),
    );
    this.cancel();
  }

  update() {
    this.store.dispatch(
      updateCustomDailyTask({
        customDailyTask: {
          id: this.updatingCustomTask!.id,
          location: this.form.controls.location.value || '',
          message: this.form.controls.message.value || '',
        },
      }),
    );
    this.cancel();
  }

  ngOnInit() {
    this.store.dispatch(getCustomDailyTasks());
  }
}
