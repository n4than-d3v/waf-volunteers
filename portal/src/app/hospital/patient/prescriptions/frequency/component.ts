import { Component, Input, OnInit } from '@angular/core';
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
export class HospitalPatientPrescriptionsFrequencyComponent implements OnInit {
  @Input({ required: true }) id!: string;
  @Input({ required: true }) formGroup!: FormGroup;

  update() {
    const frequencyType = this.formGroup.value['frequencyType'];
    const x = this.formGroup.value['frequencyX'];
    const y = this.formGroup.value['frequencyY'];
    if (frequencyType === 'rate') {
      this.formGroup.controls['frequency'].setValue(`${x} times per ${y}`);
    } else if (frequencyType === 'interval') {
      this.formGroup.controls['frequency'].setValue(`Every ${x} ${y}`);
    } else if (frequencyType === 'once') {
      this.formGroup.controls['frequency'].setValue(`One time`);
    }
  }

  ngOnInit() {
    this.update();
  }
}
