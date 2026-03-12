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
  PatientBoardAreaPenTask,
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

  markComplete(pen: PatientBoardAreaPen, task: PatientBoardAreaPenTask) {
    this.store.dispatch(
      markBoardTaskComplete({
        boardId: this.viewingBoard!,
        penId: pen.id,
        taskId: task.id,
      }),
    );
  }

  ngOnInit() {
    this.store.dispatch(viewPatientBoards());
    this.subscription = timer(0, 10_000).subscribe(() => {
      if (!this.viewingBoard) return;
      this.viewBoard(this.viewingBoard);
    });
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
