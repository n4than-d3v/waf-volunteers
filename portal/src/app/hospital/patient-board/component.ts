import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { SpinnerComponent } from '../../shared/spinner/component';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription, timer } from 'rxjs';
import { ListPatientBoard, PatientBoard, ReadOnlyWrapper } from '../state';
import { selectPatientBoard, selectPatientBoards } from '../selectors';
import { viewPatientBoard, viewPatientBoards } from '../actions';

@Component({
  selector: 'patient-board',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, SpinnerComponent, FormsModule],
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
