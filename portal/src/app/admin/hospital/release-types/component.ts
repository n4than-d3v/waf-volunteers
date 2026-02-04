import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ReleaseType, Wrapper } from '../state';
import { Store } from '@ngrx/store';
import { selectReleaseTypes } from '../selectors';
import {
  createReleaseType,
  getReleaseTypes,
  updateReleaseType,
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
  selector: 'admin-hospital-release-types',
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
export class AdminHospitalReleaseTypesComponent implements OnInit {
  releaseTypes$: Observable<Wrapper<ReleaseType>>;

  creating = false;
  updating = false;
  updatingReleaseType: ReleaseType | null = null;

  form = new FormGroup({
    description: new FormControl(''),
  });

  constructor(private store: Store) {
    this.releaseTypes$ = this.store.select(selectReleaseTypes);
  }

  beginCreate() {
    this.updating = false;
    this.creating = true;
  }

  beginUpdate(releaseType: ReleaseType) {
    this.creating = false;
    this.updating = true;
    this.updatingReleaseType = releaseType;
    this.form.controls.description.setValue(releaseType.description);
    window.scroll(0, 0);
  }

  cancel() {
    this.creating = false;
    this.updating = false;
    this.updatingReleaseType = null;
    this.form.reset();
  }

  create() {
    this.store.dispatch(
      createReleaseType({
        releaseType: {
          description: this.form.controls.description.value || '',
        },
      }),
    );
    this.cancel();
  }

  update() {
    this.store.dispatch(
      updateReleaseType({
        releaseType: {
          id: this.updatingReleaseType!.id,
          description: this.form.controls.description.value || '',
        },
      }),
    );
    this.cancel();
  }

  ngOnInit() {
    this.store.dispatch(getReleaseTypes());
  }
}
