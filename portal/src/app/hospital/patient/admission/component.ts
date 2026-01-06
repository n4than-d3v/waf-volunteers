import { Component, Input } from '@angular/core';
import { Patient, PatientStatus } from '../../state';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'hospital-patient-admission',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [DatePipe],
})
export class HospitalPatientAdmissionComponent {
  @Input({ required: true }) patient!: Patient;

  PatientStatus = PatientStatus;

  formatAdmissionReasons(patient: Patient) {
    return patient.admissionReasons.map((x) => x.description).join(', ');
  }
}
