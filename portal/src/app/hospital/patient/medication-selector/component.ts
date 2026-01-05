import { Component } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { Store } from '@ngrx/store';

@Component({
  selector: 'hospital-patient-medication-selector',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class HospitalPatientMedicationSelectorComponent {
  constructor(private store: Store) {}
}
