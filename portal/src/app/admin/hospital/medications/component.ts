import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Medication, Wrapper } from '../state';
import { Store } from '@ngrx/store';
import { selectMedications } from '../selectors';
import {
  disableMedication,
  enableMedication,
  getMedications,
} from '../actions';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'admin-hospital-medications',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [RouterLink, AsyncPipe, SpinnerComponent, FormsModule],
})
export class AdminHospitalMedicationsComponent implements OnInit {
  medications$: Observable<Wrapper<Medication>>;

  search = '';

  status: 'all' | 'enabled' | 'disabled' = 'enabled';

  columns = {
    c1: true,
    c2: true,
    c3: false,
    c4: true,
    c5: true,
    c6: false,
    c7: false,
    c8: false,
    c9: false,
  };

  constructor(private store: Store) {
    this.medications$ = this.store.select(selectMedications);
  }

  formatList(items: { name: string }[] | null | undefined) {
    if (!items || items.length === 0) {
      return '';
    }
    return items.map(this.formatItem).join(', ');
  }

  formatItem(item: { name: string } | null | undefined) {
    if (!item) {
      return '';
    }
    return item.name;
  }

  shouldShow(medication: Medication) {
    if (this.status === 'enabled' && !medication.used) {
      return false;
    }

    if (this.status === 'disabled' && medication.used) {
      return false;
    }

    if (!this.search) {
      return true;
    }

    const upper = this.search.toUpperCase();

    return (
      medication.vmdProductNo?.toUpperCase().includes(upper) ||
      medication.vmNo?.toUpperCase().includes(upper) ||
      medication.name?.toUpperCase().includes(upper) ||
      medication.maHolder?.toUpperCase().includes(upper) ||
      medication.distributors?.toUpperCase().includes(upper) ||
      medication.activeSubstances?.some((item) =>
        item.name.toUpperCase().includes(upper)
      ) ||
      medication.targetSpecies?.some((item) =>
        item.name.toUpperCase().includes(upper)
      ) ||
      medication.pharmaceuticalForm?.name.toUpperCase().includes(upper) ||
      medication.therapeuticGroup?.name.toUpperCase().includes(upper)
    );
  }

  enable(medicationId: number) {
    this.store.dispatch(
      enableMedication({
        medicationId,
      })
    );
  }

  disable(medicationId: number) {
    this.store.dispatch(
      disableMedication({
        medicationId,
      })
    );
  }

  ngOnInit() {
    this.store.dispatch(getMedications());
  }
}
