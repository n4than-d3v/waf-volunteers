import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Food, Wrapper } from '../state';
import { Store } from '@ngrx/store';
import { selectFoods } from '../selectors';
import { createFood, getFoods, updateFood } from '../actions';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { AsyncPipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'admin-hospital-foods',
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
export class AdminHospitalFoodsComponent implements OnInit {
  foods$: Observable<Wrapper<Food>>;

  creating = false;
  updating = false;
  updatingFood: Food | null = null;

  filter = '';

  form = new FormGroup({
    name: new FormControl(''),
    notes: new FormControl(''),
    substitute: new FormControl(''),
  });

  constructor(private store: Store) {
    this.foods$ = this.store.select(selectFoods);
  }

  shouldShowFood(food: Food) {
    return food.name.toLowerCase().includes(this.filter.toLowerCase());
  }

  beginCreate() {
    this.updating = false;
    this.creating = true;
  }

  beginUpdate(food: Food) {
    this.creating = false;
    this.updating = true;
    this.updatingFood = food;
    this.form.controls.name.setValue(food.name);
    this.form.controls.notes.setValue(food.notes);
    this.form.controls.substitute.setValue(food.substitute);
    window.scroll(0, 0);
  }

  cancel() {
    this.creating = false;
    this.updating = false;
    this.updatingFood = null;
    this.form.reset();
  }

  create() {
    this.store.dispatch(
      createFood({
        food: {
          name: this.form.controls.name.value || '',
          notes: this.form.controls.notes.value || '',
          substitute: this.form.controls.substitute.value || '',
        },
      }),
    );
    this.cancel();
  }

  update() {
    this.store.dispatch(
      updateFood({
        food: {
          id: this.updatingFood!.id,
          name: this.form.controls.name.value || '',
          notes: this.form.controls.notes.value || '',
          substitute: this.form.controls.substitute.value || '',
        },
      }),
    );
    this.cancel();
  }

  ngOnInit() {
    this.store.dispatch(getFoods());
  }
}
