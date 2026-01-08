import { Component, OnInit } from '@angular/core';
import { Observable, Subscription, timer } from 'rxjs';
import {
  Area,
  ListPatient,
  PatientStatus,
  Pen,
  ReadOnlyWrapper,
} from '../state';
import { Store } from '@ngrx/store';
import { selectAreas, selectPatientsByStatus } from '../selectors';
import { getAreas, getPatientsByStatus } from '../actions';
import { SpinnerComponent } from '../../shared/spinner/component';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

type AreaStatus = 'hidden' | 'summary' | 'all';

@Component({
  selector: 'patient-board',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, SpinnerComponent, FormsModule],
})
export class HospitalPatientBoardComponent implements OnInit {
  areas$: Observable<ReadOnlyWrapper<Area[]>>;
  patients$: Observable<ReadOnlyWrapper<ListPatient[]>>;

  editSettings = false;
  settings: { [id: number]: AreaStatus } = {};
  copySettings: { [id: number]: AreaStatus } = {};

  subscription: Subscription | null = null;

  constructor(private store: Store) {
    this.areas$ = this.store.select(selectAreas);
    this.patients$ = this.store.select(selectPatientsByStatus);
  }

  private getConfiguration() {
    const config = localStorage.getItem('areaConfiguration');
    if (!config) return;
    this.settings = JSON.parse(config);
    this.copySettings = { ...this.settings };
  }

  setConfiguration() {
    const config = JSON.stringify(this.copySettings);
    localStorage.setItem('areaConfiguration', config);
    this.editSettings = false;
    this.getConfiguration();
  }

  getPatientsInPen(patients: ListPatient[], pen: Pen) {
    return patients.filter((x) => x.pen?.id == pen.id);
  }

  getPatientsInArea(patients: ListPatient[], area: Area) {
    return Object.entries(
      patients
        .filter(
          (x): x is typeof x & { speciesVariant: { name: string } } =>
            x.area?.id === area.id && !!x.speciesVariant?.name
        )
        .reduce<Record<string, number>>((acc, { speciesVariant }) => {
          acc[speciesVariant.name] = (acc[speciesVariant.name] ?? 0) + 1;
          return acc;
        }, {})
    ).map(([name, count]) => `${count}x ${name}`);
  }

  ngOnInit() {
    this.getConfiguration();
    this.store.dispatch(getAreas());
    // Every 10 seconds, update patients list
    this.subscription = timer(0, 1_000 * 10).subscribe(() => {
      this.store.dispatch(
        getPatientsByStatus({
          status: PatientStatus.Inpatient,
        })
      );
    });
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
