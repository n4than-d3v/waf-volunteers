import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectPatientSummary } from './selectors';
import { Observable } from 'rxjs';
import { ReadOnlyWrapper, SpeciesType } from '../../hospital/state';
import { PatientSummary, PatientSummarySpecies } from './state';
import { getCurrentPatientsSummary } from './actions';
import { RouterLink } from '@angular/router';
import { SpinnerComponent } from '../../shared/spinner/component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'volunteer-patient-summary',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, RouterLink, SpinnerComponent],
})
export class VolunteerPatientSummaryComponent implements OnInit {
  summary$: Observable<ReadOnlyWrapper<PatientSummary>>;

  selectedSpeciesType: { speciesType: SpeciesType; title: string } | null =
    null;
  SpeciesType = SpeciesType;

  constructor(private store: Store) {
    this.summary$ = this.store.select(selectPatientSummary);
  }

  ngOnInit() {
    this.store.dispatch(getCurrentPatientsSummary());
  }

  selectSpeciesType(speciesType: SpeciesType, title: string) {
    this.selectedSpeciesType = { speciesType, title };
  }
}
