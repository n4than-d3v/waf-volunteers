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
  ReadOnlyWrapper,
} from '../state';
import { selectPatientBoard, selectPatientBoards } from '../selectors';
import {
  markBoardTaskComplete,
  markPenClean,
  viewPatientBoard,
  viewPatientBoards,
} from '../actions';
import { PatientBoardAreaDisplayType } from '../../admin/hospital/state';

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

  expandedPenReference: string | null = null;

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

  private normalizeChildHeightsPerRow() {
    const pens = Array.from(document.querySelectorAll<HTMLElement>('.pen'));
    const childSelectors = [
      '.location',
      '.patients',
      '.tags',
      '.tasks',
      '.feeding-times',
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

  shouldShowTime(time: string): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    // Convert current time to decimal hours for easier comparison
    const nowDecimal = currentHour + currentMinutes / 60;

    // Helper: convert "HH:MM" string to decimal hours
    const timeToDecimal = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h + m / 60;
    };

    // Determine which window the input time falls into
    let windowStart = 0;
    let windowEnd = 0;

    if (/^\d{2}:\d{2}$/.test(time)) {
      const targetDecimal = timeToDecimal(time);

      if (targetDecimal >= 9 && targetDecimal < 13) {
        windowStart = 0; // 8:30 am
        windowEnd = 13.5; // 1:30 pm
      } else if (targetDecimal >= 13 && targetDecimal < 18) {
        windowStart = 12.5; // 12:30 pm
        windowEnd = 18.5; // 6:30 pm
      } else if (targetDecimal >= 18 && targetDecimal < 22) {
        windowStart = 17.5; // 5:30 pm
        windowEnd = 23.999; // 10:30 pm
      } else {
        return false; // outside all windows
      }

      return nowDecimal >= windowStart && nowDecimal <= windowEnd;
    }

    // If time is "Every x hours", always show it (can adjust logic if needed)
    if (/^Every \d+ hours$/.test(time)) {
      return true; // always true in this example
    }

    return false;
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

  anyOtherBoards(areas: PatientBoardArea[]) {
    return areas.some(
      (area) =>
        area.displayType === PatientBoardAreaDisplayType.SummarisePatients,
    );
  }
}
