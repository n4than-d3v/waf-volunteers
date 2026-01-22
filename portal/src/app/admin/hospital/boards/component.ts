import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { addBoardMessage, getAreas, getBoards, upsertBoard } from '../actions';
import { Observable } from 'rxjs';
import {
  Area,
  PatientBoard,
  PatientBoardAreaDisplayType,
  Wrapper,
} from '../state';
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

  resetStart() {
    const now = moment().toISOString().split('T');
    this.startDate = now[0];
    const time = now[1].split(':');
    this.startTime = time[0] + ':' + time[1];
  }

  constructor(private store: Store) {
    this.areas$ = this.store.select(selectAreas);
    this.boards$ = this.store.select(selectBoards);
    this.resetStart();
  }

  prepareEdit(board: PatientBoard) {
    this.name = board.name;
    this.areaDisplayTypes = {};
    for (const area of board.areas) {
      this.areaDisplayTypes[String(area.area.id)] = String(area.displayType);
    }
    this.editing = board.id;
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
    this.resetStart();
    this.endDate = '';
    this.endTime = '';
  }

  ngOnInit() {
    this.store.dispatch(getAreas());
    this.store.dispatch(getBoards());
  }
}
