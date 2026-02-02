import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { addBoardMessage, getAreas, getBoards, upsertBoard } from '../actions';
import { Observable } from 'rxjs';
import { Area, PatientBoard, Wrapper } from '../state';
import { selectAreas, selectBoards } from '../selectors';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../../shared/spinner/component';
import moment from 'moment';

@Component({
  selector: 'admin-hospital-boards',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, SpinnerComponent, RouterLink, FormsModule],
})
export class AdminHospitalBoardsComponent implements OnInit {
  areas$: Observable<Wrapper<Area>>;
  boards$: Observable<Wrapper<PatientBoard>>;

  adding = false;
  editing: number | null = null;
  addingMessage: number | null = null;

  name = '';
  areaDisplayTypes: { [key: string]: string } = {};

  message = '';
  startDate = '';
  startTime = '';
  endDate = '';
  endTime = '';

  private resetDateRange() {
    const start = moment();
    const startSplit = start.toISOString().split('T');
    const startSplitTime = startSplit[1].split(':');
    this.startDate = startSplit[0];
    this.startTime = startSplitTime[0] + ':' + startSplitTime[1];

    const end = start.add(30, 'minutes');
    const endSplit = end.toISOString().split('T');
    const endSplitTime = endSplit[1].split(':');
    this.endDate = endSplit[0];
    this.endTime = endSplitTime[0] + ':' + endSplitTime[1];
  }

  constructor(private store: Store) {
    this.areas$ = this.store.select(selectAreas);
    this.boards$ = this.store.select(selectBoards);
    this.resetDateRange();
  }

  prepareEdit(board: PatientBoard) {
    this.name = board.name;
    this.areaDisplayTypes = {};
    for (const area of board.areas) {
      this.areaDisplayTypes[String(area.area.id)] = String(area.displayType);
    }
    this.editing = board.id;
  }

  prepareAddMessageForAllBoards() {
    this.addingMessage = -1;
  }

  prepareAddMessage(board: PatientBoard) {
    this.addingMessage = board.id;
  }

  addMessage() {
    this.store.dispatch(
      addBoardMessage({
        id: this.addingMessage!,
        message: this.message,
        start: this.startDate + 'T' + this.startTime + 'Z',
        end: this.endDate + 'T' + this.endTime + 'Z',
        emergency: false,
      }),
    );
    this.cancel();
  }

  saveBoard() {
    this.store.dispatch(
      upsertBoard({
        id: this.adding ? null : this.editing,
        name: this.name,
        areas: Object.keys(this.areaDisplayTypes).map((areaId) => ({
          areaId: Number(areaId),
          displayType: Number(this.areaDisplayTypes[areaId]),
        })),
      }),
    );
    this.cancel();
  }

  cancel() {
    this.adding = false;
    this.editing = null;
    this.addingMessage = null;
    this.name = '';
    this.areaDisplayTypes = {};
    this.message = '';
    this.resetDateRange();
  }

  ngOnInit() {
    this.store.dispatch(getAreas());
    this.store.dispatch(getBoards());
  }
}
