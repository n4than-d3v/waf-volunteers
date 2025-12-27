import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import {
  AssignableArea,
  AssignableShift,
  daysOfWeek,
  Job,
  MissingReason,
  Requirement,
  Time,
  Wrapper,
} from '../state';
import { Store } from '@ngrx/store';
import {
  selectAssignableAreas,
  selectAssignableShifts,
  selectJobs,
  selectMissingReasons,
  selectRequirements,
  selectTimes,
} from '../selectors';
import {
  getAssignableAreas,
  getAssignableShifts,
  getJobs,
  getMissingReasons,
  getRequirements,
  getTimes,
  updateAssignableAreas,
  updateAssignableShifts,
  updateJobs,
  updateMissingReasons,
  updateRequirements,
  updateTimes,
} from '../actions';
import { RouterLink } from '@angular/router';
import { roleList } from '../../../shared/token.provider';

@Component({
  selector: 'admin-rota-configuration',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [FormsModule, RouterLink, CommonModule],
})
export class AdminRotaConfigurationComponent implements OnInit, OnDestroy {
  daysOfWeek = daysOfWeek;

  roles = roleList;

  jobs: Job[] = [];
  newJobName = '';
  newJobBeaconAssociatedRole = '';

  missingReasons: MissingReason[] = [];
  newMissingReasonName = '';

  times: Time[] = [];
  newTimeName = '';
  newTimeStart = '';
  newTimeEnd = '';
  newTimeBeaconName = '';

  requirements: Requirement[] = [];
  newRequirementDay = -1;
  newRequirementTimeId = -1;
  newRequirementJobId = -1;
  newRequirementMinimum = 0;

  assignableShifts: AssignableShift[] = [];
  newAssignableShiftDay = -1;
  newAssignableShiftTimeId = -1;
  newAssignableShiftJobId = -1;

  assignableAreas: AssignableArea[] = [];
  newAssignableAreaName = '';

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
      this.store.select(selectAssignableShifts).subscribe(
        (assignableShifts) =>
          (this.assignableShifts = [
            ...assignableShifts.data.map((r) => ({
              ...r,
              timeId: r.time.id,
              jobId: r.job.id,
            })),
          ])
      ),
      this.store
        .select(selectAssignableAreas)
        .subscribe(
          (assignableAreas) =>
            (this.assignableAreas = structuredClone(assignableAreas.data))
        ),
    ];
  }

  ngOnInit() {
    this.store.dispatch(getJobs());
    this.store.dispatch(getMissingReasons());
    this.store.dispatch(getTimes());
    this.store.dispatch(getRequirements());
    this.store.dispatch(getAssignableShifts());
    this.store.dispatch(getAssignableAreas());
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

  removeAssignableShift(assignableShift: AssignableShift) {
    this.assignableShifts = this.assignableShifts.filter(
      (a) => a !== assignableShift
    );
  }

  removeAssignableArea(assignableArea: AssignableArea) {
    this.assignableAreas = this.assignableAreas.filter(
      (a) => a !== assignableArea
    );
  }

  isChecked(list: number[], id?: number): boolean {
    if (id == null) return false;
    return list.includes(id);
  }

  onCheckboxChange(list: number[], id: number, checked: boolean) {
    if (checked) {
      if (!list.includes(id)) {
        list.push(id);
      }
    } else {
      const index = list.indexOf(id);
      if (index !== -1) {
        list.splice(index, 1);
      }
    }
  }

  saveChanges(
    type:
      | 'jobs'
      | 'missingReasons'
      | 'times'
      | 'requirements'
      | 'assignableAreas'
      | 'assignableShifts'
  ) {
    if (type === 'jobs') {
      if (this.newJobName) {
        this.jobs.push({
          name: this.newJobName,
          beaconAssociatedRole: Number(this.newJobBeaconAssociatedRole || '0'),
          showOthersInJobIds: [],
          canAlsoDoJobIds: [],
        });
      }
      this.newJobName = '';
      this.newJobBeaconAssociatedRole = '';
      this.jobs.forEach((j) => {
        j.beaconAssociatedRole = Number(j.beaconAssociatedRole || '0');
      });
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
          beaconName: this.newTimeBeaconName,
        });
      }
      this.newTimeName = '';
      this.newTimeStart = '';
      this.newTimeEnd = '';
      this.newTimeBeaconName = '';
      for (const time of this.times) {
        if (time.start.split(':').length == 2) time.start += ':00';
        if (time.end.split(':').length == 2) time.end += ':00';
      }
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
    } else if (type === 'assignableShifts') {
      if (
        this.newAssignableShiftDay >= 0 &&
        this.newAssignableShiftTimeId > 0 &&
        this.newAssignableShiftJobId > 0
      ) {
        this.assignableShifts.push({
          day: this.newAssignableShiftDay,
          timeId: this.newAssignableShiftTimeId,
          jobId: this.newAssignableShiftJobId,
          time: this.times.find((t) => t.id === this.newAssignableShiftTimeId)!,
          job: this.jobs.find((j) => j.id === this.newAssignableShiftJobId)!,
        });
      }
      this.newAssignableShiftDay = -1;
      this.newAssignableShiftTimeId = -1;
      this.newAssignableShiftJobId = -1;
      this.assignableShifts.forEach((r) => {
        r.timeId = Number(r.timeId);
        r.jobId = Number(r.jobId);
        r.day = Number(r.day);
      });
      this.store.dispatch(
        updateAssignableShifts({
          assignableShifts: this.assignableShifts,
        })
      );
    } else if (type === 'assignableAreas') {
      if (this.newAssignableAreaName) {
        this.assignableAreas.push({ name: this.newAssignableAreaName });
      }
      this.newAssignableAreaName = '';
      this.store.dispatch(
        updateAssignableAreas({
          assignableAreas: this.assignableAreas,
        })
      );
    }
  }
}
