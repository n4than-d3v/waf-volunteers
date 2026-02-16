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
  ReadOnlyWrapper,
} from '../state';
import { selectPatientBoard, selectPatientBoards } from '../selectors';
import { viewPatientBoard, viewPatientBoards } from '../actions';

@Pipe({
  name: 'sortBoardAreas',
  standalone: true,
})
export class SortBoardAreasPipe implements PipeTransform {
  transform(areas: PatientBoardArea[]): PatientBoardArea[] {
    if (!areas) return [];

    return areas.slice().sort((a, b) => {
      const aEmpty = !a.summary || a.summary.length === 0;
      const bEmpty = !b.summary || b.summary.length === 0;

      // 1. Prioritize empty summaries
      if (aEmpty && !bEmpty) return -1;
      if (!aEmpty && bEmpty) return 1;

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

  subscription: Subscription | null = null;

  constructor(private store: Store) {
    this.boards$ = this.store.select(selectPatientBoards);
    this.board$ = this.store.select(selectPatientBoard);
  }

  viewBoard(id: number) {
    this.viewingBoard = id;
    this.store.dispatch(
      viewPatientBoard({
        id,
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
}
