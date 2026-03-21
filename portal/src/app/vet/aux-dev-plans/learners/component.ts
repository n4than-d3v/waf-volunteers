import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getAuxDevLearners, witnessAuxPerformTask } from '../actions';
import { Observable } from 'rxjs';
import { AuxDevLearner, AuxDevTask } from '../state';
import {
  selectAuxDevError,
  selectAuxDevLearners,
  selectAuxDevLoading,
} from '../selectors';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SpinnerComponent } from '../../../shared/spinner/component';

@Component({
  selector: 'aux-dev-plan-learners',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    DatePipe,
    SpinnerComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
})
export class AuxDevPlanLearnersComponent implements OnInit {
  learners$: Observable<AuxDevLearner[]>;
  loading$: Observable<boolean>;
  error$: Observable<boolean>;

  witnessingLearner: AuxDevLearner | null = null;
  witnessingTask: AuxDevTask | null = null;

  witnessForm = new FormGroup({
    notes: new FormControl(''),
    signedOff: new FormControl(false, { nonNullable: true }),
  });

  constructor(private store: Store) {
    this.learners$ = this.store.select(selectAuxDevLearners);
    this.loading$ = this.store.select(selectAuxDevLoading);
    this.error$ = this.store.select(selectAuxDevError);
  }

  cancel() {
    this.witnessingLearner = null;
    this.witnessingTask = null;
    this.witnessForm.reset();
  }

  beginWitness(learner: AuxDevLearner, task: AuxDevTask) {
    this.witnessingLearner = learner;
    this.witnessingTask = task;
  }

  witnessLearner() {
    if (!this.witnessForm.valid) return;
    this.store.dispatch(
      witnessAuxPerformTask({
        taskId: this.witnessingTask!.id,
        performerId: this.witnessingLearner!.id,
        notes: this.witnessForm.value.notes || '',
        signedOff: this.witnessForm.value.signedOff!,
      }),
    );
    this.cancel();
  }

  ngOnInit() {
    this.store.dispatch(getAuxDevLearners());
  }
}
