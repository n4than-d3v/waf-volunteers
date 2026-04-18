import {
  Component,
  OnDestroy,
  OnInit,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { SpinnerComponent } from '../../shared/spinner/component';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  Subscription,
  timer,
} from 'rxjs';
import {
  ListPatientBoard,
  PatientBoardAreaPen,
  ReadOnlyWrapper,
  Task,
} from '../state';
import {
  selectMarkBoard,
  selectMarkPenClean,
  selectPatientBoard,
  selectPatientBoards,
} from '../selectors';
import {
  markBoardTaskComplete,
  markPenClean,
  viewPatientBoard,
  viewPatientBoards,
} from '../actions';
import { PatientBoardAreaDisplayType } from '../../admin/hospital/state';
import { PatientBoardAreaVm, PatientBoardVm, Shift } from './board.model';
import { transform } from './board.transformer';
import { svgs } from './svgs';

@Pipe({
  name: 'sortBoardAreas',
  standalone: true,
})
export class SortBoardAreasPipe implements PipeTransform {
  transform(areas: PatientBoardAreaVm[]): PatientBoardAreaVm[] {
    if (!areas) return [];

    return areas.slice().sort((a, b) => {
      const aEmpty =
        !a.displayType ||
        a.displayType !== PatientBoardAreaDisplayType.ShowPatients;
      const bEmpty =
        !b.displayType ||
        b.displayType !== PatientBoardAreaDisplayType.ShowPatients;

      // 1. De-prioritize empty pens
      if (aEmpty && !bEmpty) return 1;
      if (!aEmpty && bEmpty) return -1;

      // 2. Sort alphabetically by area name
      const nameA = a.area.area.name.toLowerCase();
      const nameB = b.area.area.name.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }
}

@Component({
  selector: 'patient-board',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: [
    './component.scss',
    './board-main.scss',
    './board-bird.scss',
    './emergency.scss',
  ],
  imports: [AsyncPipe, SpinnerComponent, SortBoardAreasPipe, FormsModule],
})
export class HospitalPatientBoardComponent implements OnInit, OnDestroy {
  boards$: Observable<ReadOnlyWrapper<ListPatientBoard[]>>;
  board$: Observable<PatientBoardVm | null>;

  viewingBoard: number | null = null;

  expandedPens: { [key: string]: boolean } = {};
  tickingTask = '';

  expandFeedingSummary = false;
  showPatientReferences = false;

  markBoard: Observable<Task>;
  markPenClean: Observable<Task>;

  showPensWithoutFeeds$ = new BehaviorSubject(true);
  showPensNeedCleaning$ = new BehaviorSubject(true);
  showTickedOffPens$ = new BehaviorSubject(true);
  shift$ = new BehaviorSubject<Shift>('M');

  svgs = svgs;

  get showPensWithoutFeeds(): boolean {
    return this.showPensWithoutFeeds$.value;
  }

  set showPensWithoutFeeds(val: boolean) {
    this.showPensWithoutFeeds$.next(val);
  }

  get showPensNeedCleaning(): boolean {
    return this.showPensNeedCleaning$.value;
  }

  set showPensNeedCleaning(val: boolean) {
    this.showPensNeedCleaning$.next(val);
  }

  get showTickedOffPens(): boolean {
    return this.showTickedOffPens$.value;
  }

  set showTickedOffPens(val: boolean) {
    this.showTickedOffPens$.next(val);
  }

  get shift(): Shift {
    return this.shift$.value;
  }

  set shift(val: Shift) {
    this.shift$.next(val);
  }

  subscription: Subscription | null = null;

  constructor(private store: Store) {
    this.boards$ = this.store.select(selectPatientBoards);
    this.markBoard = this.store.select(selectMarkBoard);
    this.markPenClean = this.store.select(selectMarkPenClean);
    this.board$ = combineLatest([
      this.store.select(selectPatientBoard),
      this.showPensWithoutFeeds$,
      this.showPensNeedCleaning$,
      this.showTickedOffPens$,
      this.shift$,
    ]).pipe(
      map(
        ([
          wrapper,
          showPensWithoutFeeds,
          showPensNeedCleaning,
          showTickedOffPens,
          shift,
        ]) => {
          return transform(
            wrapper,
            showPensWithoutFeeds,
            showPensNeedCleaning,
            showTickedOffPens,
            shift,
          );
        },
      ),
    );
  }

  PatientBoardAreaDisplayType = PatientBoardAreaDisplayType;

  viewBoard(id: number) {
    this.viewingBoard = id;
    this.store.dispatch(
      viewPatientBoard({
        id,
      }),
    );
  }

  markClean(pen: PatientBoardAreaPen) {
    this.tickingTask = pen.reference;
    this.store.dispatch(
      markPenClean({
        boardId: this.viewingBoard!,
        penId: pen.id,
      }),
    );
  }

  markComplete(pen: PatientBoardAreaPen, taskId: number) {
    this.tickingTask = `${pen.reference}_${taskId}`;
    this.store.dispatch(
      markBoardTaskComplete({
        boardId: this.viewingBoard!,
        penId: pen.id,
        taskId,
      }),
    );
  }

  ngOnInit() {
    this.store.dispatch(viewPatientBoards());
    this.subscription = new Subscription();
    this.subscription.add(
      timer(0, 10_000).subscribe(() => {
        if (!this.viewingBoard) return;
        this.viewBoard(this.viewingBoard);
      }),
    );
    this.subscription.add(
      this.markBoard.subscribe((task) => {
        if (task.success || task.error) {
          this.tickingTask = '';
        }
      }),
    );
    this.subscription.add(
      this.markPenClean.subscribe((task) => {
        if (task.success || task.error) {
          this.tickingTask = '';
        }
      }),
    );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
