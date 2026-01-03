import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ReleaseType, TransferLocation, Wrapper } from '../state';
import { Store } from '@ngrx/store';
import { selectTransferLocations } from '../selectors';
import {
  createTransferLocation,
  getTransferLocations,
  updateTransferLocation,
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
  selector: 'admin-hospital-transfer-locations',
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
export class AdminHospitalTransferLocationsComponent implements OnInit {
  transferLocations$: Observable<Wrapper<TransferLocation>>;

  creating = false;
  updating = false;
  updatingTransferLocation: TransferLocation | null = null;

  form = new FormGroup({
    description: new FormControl(''),
  });

  constructor(private store: Store) {
    this.transferLocations$ = this.store.select(selectTransferLocations);
  }

  beginCreate() {
    this.updating = false;
    this.creating = true;
  }

  beginUpdate(transferLocation: TransferLocation) {
    this.creating = false;
    this.updating = true;
    this.updatingTransferLocation = transferLocation;
    this.form.controls.description.setValue(transferLocation.description);
  }

  cancel() {
    this.creating = false;
    this.updating = false;
    this.updatingTransferLocation = null;
    this.form.reset();
  }

  create() {
    this.store.dispatch(
      createTransferLocation({
        transferLocation: {
          description: this.form.controls.description.value || '',
        },
      })
    );
    this.cancel();
  }

  update() {
    this.store.dispatch(
      updateTransferLocation({
        transferLocation: {
          id: this.updatingTransferLocation!.id,
          description: this.form.controls.description.value || '',
        },
      })
    );
    this.cancel();
  }

  ngOnInit() {
    this.store.dispatch(getTransferLocations());
  }
}
