import { Component, Input } from '@angular/core';
import { Patient, PatientStatus } from '../../state';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'hospital-patient-details',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [],
})
export class HospitalPatientDetailsComponent {
  @Input({ required: true }) patient!: Patient;

  PatientStatus = PatientStatus;
}
