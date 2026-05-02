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

  name = '';
  forBirds = false;
  sumUp = false;
  areaDisplayTypes: { [key: string]: string } = {};

  filter = '';

  shouldShowBoard(board: PatientBoard): boolean {
    return board.name.toLowerCase().includes(this.filter.toLowerCase());
  }

  constructor(private store: Store) {
    this.areas$ = this.store.select(selectAreas);
    this.boards$ = this.store.select(selectBoards);
  }

  prepareEdit(board: PatientBoard) {
    this.name = board.name;
    this.forBirds = board.forBirds;
    this.sumUp = board.sumUp;
    this.areaDisplayTypes = {};
    for (const area of board.areas) {
      this.areaDisplayTypes[String(area.area.id)] = String(area.displayType);
    }
    this.editing = board.id;
    window.scroll(0, 0);
  }

  saveBoard() {
    this.store.dispatch(
      upsertBoard({
        id: this.adding ? null : this.editing,
        name: this.name,
        forBirds: this.forBirds,
        sumUp: this.sumUp,
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
    this.name = '';
    this.forBirds = false;
    this.sumUp = false;
    this.areaDisplayTypes = {};
  }

  ngOnInit() {
    this.store.dispatch(getAreas());
    this.store.dispatch(getBoards());
  }
}
