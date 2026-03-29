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
import { Observable, Subscription, timer } from 'rxjs';
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

@Pipe({
  name: 'sortBoardAreas',
  standalone: true,
})
export class SortBoardAreasPipe implements PipeTransform {
  transform(areas: PatientBoardArea[]): PatientBoardArea[] {
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
  styleUrls: ['./component.scss', './emergency.scss'],
  imports: [AsyncPipe, SpinnerComponent, SortBoardAreasPipe, FormsModule],
})
export class HospitalPatientBoardComponent implements OnInit, OnDestroy {
  boards$: Observable<ReadOnlyWrapper<ListPatientBoard[]>>;
  board$: Observable<ReadOnlyWrapper<PatientBoard>>;

  viewingBoard: number | null = null;

  expandedPens: string[] = [];

  expandFeedingSummary = false;
  showPatientReferences = false;
  showPensWithoutFeeds = true;
  showPensNeedCleaning = true;

  subscription: Subscription | null = null;

  constructor(private store: Store) {
    this.boards$ = this.store.select(selectPatientBoards);
    this.board$ = this.store.select(selectPatientBoard);
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

  expandPen(pen: PatientBoardAreaPen) {
    this.expandedPens.push(pen.reference);
  }

  collapsePen(pen: PatientBoardAreaPen) {
    this.expandedPens = this.expandedPens.filter((x) => x !== pen.reference);
  }

  isPenExpandable(pen: PatientBoardAreaPen): boolean {
    if (!pen.feedings?.length) return false;
    return pen.feedings.some((f) => this.shouldShowTime(f.time));
  }

  shouldShowPen(pen: PatientBoardAreaPen) {
    if (pen.needsCleaning) {
      return this.showPensNeedCleaning;
    }
    if (!this.showPensWithoutFeeds) {
      return this.hasFeeds(pen.feedings || []);
    }
    return true;
  }

  formatNumber = formatFractionalNumber;

  private normalizeChildHeightsPerRow() {
    const pens = Array.from(document.querySelectorAll<HTMLElement>('.pen'));
    const childSelectors = [
      '.location',
      '.patients',
      '.tags',
      '.tasks',
      '.feeding-times',
      '.force-feeds',
    ];

    // Group pens by row
    const rows: HTMLElement[][] = [];
    let currentRowTop = -1;
    let currentRow: HTMLElement[] = [];

    pens.forEach((pen) => {
      if (pen.offsetTop !== currentRowTop) {
        // new row
        if (currentRow.length) rows.push(currentRow);
        currentRow = [pen];
        currentRowTop = pen.offsetTop;
      } else {
        currentRow.push(pen);
      }
    });
    if (currentRow.length) rows.push(currentRow);

    // Normalize each child type per row
    rows.forEach((row) => {
      childSelectors.forEach((selector) => {
        const elements = row.flatMap((pen) =>
          Array.from(pen.querySelectorAll<HTMLElement>(selector)),
        );
        if (!elements.length) return;

        // Find max height
        let maxHeight = 0;
        elements.forEach((el) => {
          el.style.setProperty('--min-height', `0px`);
          const height = el.offsetHeight;
          if (height > maxHeight) maxHeight = height;
        });

        // Apply max height to all elements in this row
        elements.forEach((el) => {
          el.style.setProperty('--min-height', `${maxHeight + 1}px`);
        });
      });
    });
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

  shouldShowTime(time: string): boolean {
    const nowDecimal = this.nowToDecimal();

    if (/^\d{2}:\d{2}$/.test(time)) {
      const targetDecimal = this.timeToDecimal(time);

      if (0 <= nowDecimal && nowDecimal < 12.5)
        return 0 <= targetDecimal && targetDecimal <= 12.99;
      if (12.5 <= nowDecimal && nowDecimal < 13)
        return 0 <= targetDecimal && targetDecimal <= 17.99;
      if (13 <= nowDecimal && nowDecimal < 17.5)
        return 13 <= targetDecimal && targetDecimal <= 17.99;
      if (17.5 <= nowDecimal && nowDecimal < 18)
        return 13 <= targetDecimal && targetDecimal <= 23.99;
      if (18 <= nowDecimal && nowDecimal < 24)
        return 18 <= targetDecimal && targetDecimal <= 23.99;

      return false;
    }

    return true;
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
      timer(0, 250).subscribe(() => {
        this.normalizeChildHeightsPerRow();
      }),
    );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  isCurrentShift(shift: 'M' | 'A' | 'E') {
    const nowDecimal = this.nowToDecimal();

    if (shift === 'M' && 0 <= nowDecimal && nowDecimal < 13) return true;
    if (shift === 'A' && 13 <= nowDecimal && nowDecimal < 18) return true;
    if (shift === 'E' && 18 <= nowDecimal && nowDecimal < 24) return true;
    return false;
  }

  isNow(time: string) {
    if (/^\d{2}:\d{2}$/.test(time)) {
      const nowDecimal = this.nowToDecimal();
      const timeDecimal = this.timeToDecimal(time);
      return Math.abs(nowDecimal - timeDecimal) < 0.5;
    }
    return false;
  }

  hasFeeds(feedings: PatientBoardAreaPenFeeding[]) {
    return feedings.some((time) => this.shouldShowTime(time.time));
  }

  hasForceFeeds(feedings: PatientBoardAreaPenTaskDetails[]) {
    return feedings.some((item) => item.forceFeed);
  }

  getForceFeeds(feedings: PatientBoardAreaPenFeeding[]) {
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

  groupFeeding(items: PatientBoardAreaPenTaskDetails[]): FoodSection[] {
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

  anyOtherBoards(areas: PatientBoardArea[]) {
    return areas.some(
      (area) =>
        area.displayType === PatientBoardAreaDisplayType.SummarisePatients,
    );
  }
}
