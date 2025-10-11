import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import {
  daysOfWeek,
  Job,
  MissingReason,
  Requirement,
  Time,
  Wrapper,
} from '../state';
import { Store } from '@ngrx/store';
import {
  selectJobs,
  selectMissingReasons,
  selectRequirements,
  selectTimes,
} from '../selectors';
import {
  getJobs,
  getMissingReasons,
  getRequirements,
  getTimes,
  updateJobs,
  updateMissingReasons,
  updateRequirements,
  updateTimes,
} from '../actions';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'admin-rota-configuration',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [FormsModule, RouterLink],
})
export class AdminRotaConfigurationComponent implements OnInit, OnDestroy {
  daysOfWeek = daysOfWeek;

  jobs: Job[] = [];
  newJobName = '';

  missingReasons: MissingReason[] = [];
  newMissingReasonName = '';

  times: Time[] = [];
  newTimeName = '';
  newTimeStart = '';
  newTimeEnd = '';

  requirements: Requirement[] = [];
  newRequirementDay = -1;
  newRequirementTimeId = -1;
  newRequirementJobId = -1;
  newRequirementMinimum = 0;

  subscriptions: Subscription[];

  constructor(private store: Store) {
    this.subscriptions = [
      this.store
        .select(selectJobs)
        .subscribe((jobs) => (this.jobs = structuredClone(jobs.data))),
      this.store
        .select(selectMissingReasons)
        .subscribe(
          (missingReasons) =>
            (this.missingReasons = structuredClone(missingReasons.data))
        ),
      this.store
        .select(selectTimes)
        .subscribe((times) => (this.times = structuredClone(times.data))),
      this.store.select(selectRequirements).subscribe(
        (requirements) =>
          (this.requirements = [
            ...requirements.data.map((r) => ({
              ...r,
              timeId: r.time.id,
              jobId: r.job.id,
            })),
          ])
      ),
    ];
  }

  ngOnInit() {
    this.store.dispatch(getJobs());
    this.store.dispatch(getMissingReasons());
    this.store.dispatch(getTimes());
    this.store.dispatch(getRequirements());
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  removeJob(job: Job) {
    this.jobs = this.jobs.filter((j) => j !== job);
  }

  removeMissingReason(missingReason: MissingReason) {
    this.missingReasons = this.missingReasons.filter(
      (m) => m !== missingReason
    );
  }

  removeTime(time: Time) {
    this.times = this.times.filter((t) => t !== time);
  }

  removeRequirement(requirement: Requirement) {
    this.requirements = this.requirements.filter((r) => r !== requirement);
  }

  saveChanges(type: 'jobs' | 'missingReasons' | 'times' | 'requirements') {
    if (type === 'jobs') {
      if (this.newJobName) {
        this.jobs.push({ name: this.newJobName });
      }
      this.newJobName = '';
      this.store.dispatch(
        updateJobs({
          jobs: this.jobs,
        })
      );
    } else if (type === 'missingReasons') {
      if (this.newMissingReasonName) {
        this.missingReasons.push({ name: this.newMissingReasonName });
      }
      this.newMissingReasonName = '';
      this.store.dispatch(
        updateMissingReasons({
          missingReasons: this.missingReasons,
        })
      );
    } else if (type === 'times') {
      if (this.newTimeName && this.newTimeStart && this.newTimeEnd) {
        this.times.push({
          name: this.newTimeName,
          start: this.newTimeStart,
          end: this.newTimeEnd,
        });
      }
      this.newTimeName = '';
      this.newTimeStart = '';
      this.newTimeEnd = '';
      this.store.dispatch(
        updateTimes({
          times: this.times,
        })
      );
    } else if (type === 'requirements') {
      if (
        this.newRequirementDay >= 0 &&
        this.newRequirementTimeId > 0 &&
        this.newRequirementJobId > 0
      ) {
        this.requirements.push({
          day: this.newRequirementDay,
          timeId: this.newRequirementTimeId,
          jobId: this.newRequirementJobId,
          minimum: this.newRequirementMinimum,
          time: this.times.find((t) => t.id === this.newRequirementTimeId)!,
          job: this.jobs.find((j) => j.id === this.newRequirementJobId)!,
        });
      }
      this.newRequirementDay = -1;
      this.newRequirementTimeId = -1;
      this.newRequirementJobId = -1;
      this.newRequirementMinimum = 0;
      this.requirements.forEach((r) => {
        r.timeId = Number(r.timeId);
        r.jobId = Number(r.jobId);
        r.day = Number(r.day);
      });
      this.store.dispatch(
        updateRequirements({
          requirements: this.requirements,
        })
      );
    }
  }
}
