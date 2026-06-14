import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Area, Pen, PenCleanStatus, ReadOnlyWrapper, Task } from '../state';
import { selectAreas, selectSetPenCleanStatus } from '../selectors';
import { SpinnerComponent } from '../../shared/spinner/component';
import { getAreas, setPenCleanStatus } from '../actions';

@Component({
  selector: 'hospital-pen-management',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, SpinnerComponent, FormsModule, ReactiveFormsModule],
})
export class HospitalPenManagementComponent implements OnInit, OnDestroy {
  areas$: Observable<ReadOnlyWrapper<Area[]>>;
  task$: Observable<Task>;

  subscription: Subscription;

  search = '';

  empty: boolean = true;
  inUse: boolean = true;
  available: boolean = true;
  needsCleaning: boolean = true;
  needsSettingUp: boolean = true;
  readyToUse: boolean = true;
  custom: boolean = true;

  settingCustom: number | null = null;
  customBoardMessage = '';

  constructor(private store: Store) {
    this.areas$ = this.store.select(selectAreas);
    this.task$ = this.store.select(selectSetPenCleanStatus);
    this.subscription = this.task$.subscribe((task) => {
      if (task.success) {
        this.store.dispatch(getAreas());
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(getAreas());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  shouldShowArea(area: Area) {
    return area.pens.some((pen) => this.shouldShowPen(pen));
  }

  shouldShowPen(pen: Pen) {
    if (pen.deleted) return false;
    if (this.search && !pen.reference.includes(this.search.toUpperCase()))
      return false;
    if (pen.empty && !this.empty) return false;
    if (!pen.empty && !this.inUse) return false;
    if (pen.cleanStatus === PenCleanStatus.None && !this.available)
      return false;
    if (pen.cleanStatus === PenCleanStatus.NeedsCleaning && !this.needsCleaning)
      return false;
    if (
      pen.cleanStatus === PenCleanStatus.NeedsSettingUp &&
      !this.needsSettingUp
    )
      return false;
    if (pen.cleanStatus === PenCleanStatus.ReadyToUse && !this.readyToUse)
      return false;
    if (pen.cleanStatus === PenCleanStatus.Custom && !this.custom) return false;
    return true;
  }

  clearSettingCustom() {
    this.settingCustom = null;
    this.customBoardMessage = '';
  }

  setCleanStatus(
    pen: Pen,
    cleanStatus: PenCleanStatus,
    customBoardMessage?: string,
  ) {
    this.store.dispatch(
      setPenCleanStatus({
        boardId: 0,
        penId: pen.id,
        cleanStatus,
        customBoardMessage,
      }),
    );
  }

  PenCleanStatus = PenCleanStatus;
}
