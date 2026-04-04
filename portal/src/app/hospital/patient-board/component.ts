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
  PatientBoard,
  PatientBoardArea,
  PatientBoardAreaPen,
  PatientBoardAreaPenFeeding,
  PatientBoardAreaPenTaskDetails,
  ReadOnlyWrapper,
} from '../state';
import { selectPatientBoard, selectPatientBoards } from '../selectors';
import {
  markBoardTaskComplete,
  markPenClean,
  viewPatientBoard,
  viewPatientBoards,
} from '../actions';
import {
  formatFractionalNumber,
  PatientBoardAreaDisplayType,
} from '../../admin/hospital/state';
import { FoodSection } from './food-section';
import {
  PatientBoardAreaPenFeedingSummaryVm,
  PatientBoardAreaPenFeedingVm,
  PatientBoardAreaPenTaskDetailsVm,
  PatientBoardAreaPenVm,
  PatientBoardAreaVm,
  PatientBoardSummaryFeedingItemVm,
  PatientBoardSummaryFeedingVm,
  PatientBoardSummaryVariantVm,
  PatientBoardSummaryVm,
  PatientBoardVm,
} from './board.model';

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

  expandFeedingSummary = false;
  showPatientReferences = false;

  showPensWithoutFeeds$ = new BehaviorSubject(true);
  showPensNeedCleaning$ = new BehaviorSubject(true);

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

  subscription: Subscription | null = null;

  constructor(private store: Store) {
    this.boards$ = this.store.select(selectPatientBoards);
    const patientBoard$ = this.store.select(selectPatientBoard);
    this.board$ = combineLatest([
      patientBoard$,
      this.showPensWithoutFeeds$,
      this.showPensNeedCleaning$,
    ]).pipe(
      map(([wrapper]) => {
        if (!wrapper.data) return null;

        return {
          board: { ...wrapper.data.board },
          areas: (wrapper.data.areas || []).map(
            (area): PatientBoardAreaVm => ({
              ...area,
              pens: (area.pens || []).map(
                (pen): PatientBoardAreaPenVm => ({
                  ...pen,
                  shouldShow: this.shouldShowPen(pen),
                  nextFeeding: this.getNextFeeding(pen.feedings || []),
                  forceFeeds: this.getForceFeeds(pen.feedings || []),
                  isExpandable: this.isPenExpandable(pen),
                  feedings: (pen.feedings || []).map(
                    (feeding): PatientBoardAreaPenFeedingVm => {
                      const details = (feeding.details || []).map(
                        (detail): PatientBoardAreaPenTaskDetailsVm => ({
                          ...detail,
                          quantityEachFormatted: formatFractionalNumber(
                            detail.quantityEach,
                          ),
                          quantityTotalFormatted: formatFractionalNumber(
                            detail.quantityTotal,
                          ),
                        }),
                      );
                      return {
                        ...feeding,
                        details,
                        isNow: this.isNow(feeding.time),
                        shouldShow: this.shouldShowTime(feeding.time),
                        hasForceFeeds: this.hasForceFeeds(feeding.details),
                        groups: this.groupFeeding(details),
                      };
                    },
                  ),
                  feedingSummaries: (pen.feedingSummaries || []).map(
                    (summary): PatientBoardAreaPenFeedingSummaryVm => ({
                      ...summary,
                      quantityEachFormatted: formatFractionalNumber(
                        summary.quantityEach,
                      ),
                    }),
                  ),
                }),
              ),
            }),
          ),
          summary: (wrapper.data.summary || []).map(
            (summary): PatientBoardSummaryVm => ({
              ...summary,
              variants: (summary.variants || []).map(
                (variant): PatientBoardSummaryVariantVm => ({
                  ...variant,
                  feeding: (variant.feeding || []).map(
                    (feeding): PatientBoardSummaryFeedingVm => ({
                      ...feeding,
                      items: (feeding.items || []).map(
                        (item): PatientBoardSummaryFeedingItemVm => ({
                          ...item,
                          quantityValueFormatted: formatFractionalNumber(
                            item.quantityValue,
                          ),
                        }),
                      ),
                      shouldShow: this.shouldShowTime(feeding.time),
                    }),
                  ),
                }),
              ),
            }),
          ),
          anyOtherBoards: this.anyOtherBoards(wrapper.data.areas),
          isMorning: this.isCurrentShift('M'),
          isAfternoon: this.isCurrentShift('A'),
          isEvening: this.isCurrentShift('E'),
        };
      }),
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
    this.store.dispatch(
      markPenClean({
        boardId: this.viewingBoard!,
        penId: pen.id,
      }),
    );
  }

  markComplete(pen: PatientBoardAreaPen, taskId: number) {
    this.store.dispatch(
      markBoardTaskComplete({
        boardId: this.viewingBoard!,
        penId: pen.id,
        taskId,
      }),
    );
  }

  private isPenExpandable(pen: PatientBoardAreaPen): boolean {
    if (!pen.feedings?.length) return false;
    return pen.feedings.some((f) => this.shouldShowTime(f.time));
  }

  private shouldShowPen(pen: PatientBoardAreaPen) {
    if (pen.needsCleaning) {
      return this.showPensNeedCleaning$.value;
    }
    if (!this.showPensWithoutFeeds$.value) {
      return this.hasFeeds(pen.feedings || []);
    }
    return true;
  }

  private nowToDecimal() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    // Convert current time to decimal hours for easier comparison
    return currentHour + currentMinutes / 60;
  }

  // Helper: convert "HH:MM" string to decimal hours
  private timeToDecimal(t: string) {
    const [h, m] = t.split(':').map(Number);
    return h + m / 60;
  }

  private shouldShowTime(time: string): boolean {
    const nowDecimal = this.nowToDecimal();

    if (/^\d{2}:\d{2}$/.test(time)) {
      const targetDecimal = this.timeToDecimal(time);

      if (0 <= nowDecimal && nowDecimal < 13)
        return 0 <= targetDecimal && targetDecimal < 13;
      if (13 <= nowDecimal && nowDecimal < 18)
        return 13 <= targetDecimal && targetDecimal < 18;
      if (18 <= nowDecimal && nowDecimal < 24)
        return 18 <= targetDecimal && targetDecimal < 24;

      return false;
    }

    return true;
  }

  private isCurrentShift(shift: 'M' | 'A' | 'E') {
    const nowDecimal = this.nowToDecimal();

    if (shift === 'M' && 0 <= nowDecimal && nowDecimal < 13) return true;
    if (shift === 'A' && 13 <= nowDecimal && nowDecimal < 18) return true;
    if (shift === 'E' && 18 <= nowDecimal && nowDecimal < 24) return true;
    return false;
  }

  private getNextFeeding(
    feedings: PatientBoardAreaPenFeeding[],
  ): { isNow: boolean; time: string } | null {
    const nowDecimal = this.nowToDecimal();
    const next = feedings
      .filter((f) => /^\d{2}:\d{2}$/.test(f.time))
      .filter((f) => this.shouldShowTime(f.time))
      .map((f) => ({ ...f, decimalTime: this.timeToDecimal(f.time) }))
      .filter((f) => f.decimalTime >= nowDecimal - 0.25)
      .sort((a, b) => a.decimalTime - b.decimalTime);
    if (next.length === 0) return null;
    return { isNow: this.isNow(next[0].time), time: next[0].time };
  }

  private isNow(time: string) {
    if (/^\d{2}:\d{2}$/.test(time)) {
      const nowDecimal = this.nowToDecimal();
      const timeDecimal = this.timeToDecimal(time);
      return Math.abs(nowDecimal - timeDecimal) < 0.25;
    }
    return false;
  }

  private hasFeeds(feedings: PatientBoardAreaPenFeeding[]) {
    return feedings.some((time) => this.shouldShowTime(time.time));
  }

  private hasForceFeeds(feedings: PatientBoardAreaPenTaskDetails[]) {
    return feedings.some((item) => item.forceFeed);
  }

  private getForceFeeds(feedings: PatientBoardAreaPenFeeding[]) {
    const times = feedings.filter((time) => this.shouldShowTime(time.time));
    if (!times.some((time) => this.hasForceFeeds(time.details))) return [];

    const result = new Set<string>();

    times.forEach((time) => {
      time.details.forEach((item) => {
        const description = `${item.quantityEach} ${item.quantityUnit} ${item.food}`;
        result.add(description.trim());
      });
    });
    return [...result];
  }

  private groupFeeding(
    items: PatientBoardAreaPenTaskDetailsVm[],
  ): FoodSection[] {
    const hasDishes = items.some((item) => !!item.dish);
    const hasTopUps = items.some((item) => item.topUp);

    const map = new Map<string, FoodSection>();

    for (const item of items) {
      const key = `${item.dish}__${item.topUp}__${item.forceFeed}`;

      if (!map.has(key)) {
        map.set(key, {
          key,
          title: (
            (item.forceFeed
              ? '(Force feed)'
              : item.topUp
                ? '(Top up)'
                : hasTopUps
                  ? '(Feed)'
                  : '') +
            ' ' +
            (item.dish ? item.dish : hasDishes ? 'Separate' : '')
          ).trim(),
          details: [],
        });
      }

      map.get(key)!.details.push(item);
    }

    return Array.from(map.values());
  }

  private anyOtherBoards(areas: PatientBoardArea[]) {
    return areas.some(
      (area) =>
        area.displayType === PatientBoardAreaDisplayType.SummarisePatients,
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
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
