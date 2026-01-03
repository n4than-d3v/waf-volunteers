import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AdministrationMethod, Wrapper } from '../state';
import { Store } from '@ngrx/store';
import { selectAdministrationMethods } from '../selectors';
import {
  createAdministrationMethod,
  getAdministrationMethods,
  updateAdministrationMethod,
} from '../actions';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { AsyncPipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'admin-hospital-administration-methods',
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
export class AdminHospitalAdministrationMethodsComponent implements OnInit {
  administrationMethods$: Observable<Wrapper<AdministrationMethod>>;

  creating = false;
  updating = false;
  updatingAdministrationMethod: AdministrationMethod | null = null;

  form = new FormGroup({
    description: new FormControl(''),
  });

  constructor(private store: Store) {
    this.administrationMethods$ = this.store.select(
      selectAdministrationMethods
    );
  }

  beginCreate() {
    this.updating = false;
    this.creating = true;
  }

  beginUpdate(administrationMethod: AdministrationMethod) {
    this.creating = false;
    this.updating = true;
    this.updatingAdministrationMethod = administrationMethod;
    this.form.controls.description.setValue(administrationMethod.description);
  }

  cancel() {
    this.creating = false;
    this.updating = false;
    this.updatingAdministrationMethod = null;
    this.form.reset();
  }

  create() {
    this.store.dispatch(
      createAdministrationMethod({
        administrationMethod: {
          description: this.form.controls.description.value || '',
        },
      })
    );
    this.cancel();
  }

  update() {
    this.store.dispatch(
      updateAdministrationMethod({
        administrationMethod: {
          id: this.updatingAdministrationMethod!.id,
          description: this.form.controls.description.value || '',
        },
      })
    );
    this.cancel();
  }

  ngOnInit() {
    this.store.dispatch(getAdministrationMethods());
  }
}
