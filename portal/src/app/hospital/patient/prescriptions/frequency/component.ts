import { Component, Input } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'hospital-patient-prescriptions-frequency',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [FormsModule, ReactiveFormsModule],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class HospitalPatientPrescriptionsFrequencyComponent {
  @Input({ required: true }) id!: string;
  @Input({ required: true }) control!: string;
  @Input({ required: true }) formGroup!: FormGroup;

  frequencyType: '' | 'rate' | 'interval' = '';

  x: number | null = null;
  y: string | null = null;

  update() {
    if (this.frequencyType === 'rate') {
      this.formGroup.controls[this.control].setValue(`${this.x} ${this.y}`);
    } else if (this.frequencyType === 'interval') {
      this.formGroup.controls[this.control].setValue(
        `Every ${this.x} ${this.y}`
      );
    }
  }
}
