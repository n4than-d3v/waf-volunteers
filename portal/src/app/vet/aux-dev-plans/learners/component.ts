import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getAuxDevLearners, witnessAuxPerformTask } from '../actions';
import { Observable } from 'rxjs';
import { AuxDevLearner, AuxDevTask } from '../state';
import { selectAuxDevLearners } from '../selectors';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'aux-dev-plan-learners',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, DatePipe, FormsModule, ReactiveFormsModule, RouterLink],
})
export class AuxDevPlanLearnersComponent implements OnInit {
  learners$: Observable<AuxDevLearner[]>;

  witnessingLearner: AuxDevLearner | null = null;
  witnessingTask: AuxDevTask | null = null;

  witnessForm = new FormGroup({
    notes: new FormControl(''),
    signedOff: new FormControl(false, { nonNullable: true }),
  });

  constructor(private store: Store) {
    this.learners$ = this.store.select(selectAuxDevLearners);
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
