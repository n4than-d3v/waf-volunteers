import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Area, Wrapper } from '../state';
import { Store } from '@ngrx/store';
import { selectAreas } from '../selectors';
import { createArea, createPen, getAreas } from '../actions';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { AsyncPipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'admin-hospital-areas',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    RouterLink,
    AsyncPipe,
    SpinnerComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AdminHospitalAreasComponent implements OnInit {
  areas$: Observable<Wrapper<Area>>;

  creatingArea = false;
  creatingPen = false;
  creatingPenForArea: Area | null = null;

  areaForm = new FormGroup({
    code: new FormControl(''),
    name: new FormControl(''),
  });

  penForm = new FormGroup({
    areaId: new FormControl(''),
    code: new FormControl(''),
  });

  constructor(private store: Store) {
    this.areas$ = this.store.select(selectAreas);
  }

  formatPens(area: Area) {
    return area.pens.map((x) => area.code + '-' + x.code).join(', ');
  }

  beginCreateArea() {
    this.creatingArea = true;
    this.creatingPen = false;
  }

  beginCreatePen(area: Area) {
    this.creatingArea = false;
    this.creatingPen = true;
    this.creatingPenForArea = area;
  }

  cancel() {
    this.creatingArea = false;
    this.creatingPen = false;
    this.areaForm.reset();
    this.penForm.reset();
  }

  createArea() {
    this.store.dispatch(
      createArea({
        area: {
          code: this.areaForm.controls.code.value || '',
          name: this.areaForm.controls.name.value || '',
        },
      })
    );
    this.cancel();
  }

  createPen() {
    this.store.dispatch(
      createPen({
        pen: {
          areaId: this.creatingPenForArea!.id,
          code: this.penForm.controls.code.value || '',
        },
      })
    );
    this.cancel();
  }

  ngOnInit() {
    this.store.dispatch(getAreas());
  }
}
