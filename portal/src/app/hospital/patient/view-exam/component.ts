import { Component, Input } from '@angular/core';
import {
  getSex,
  getWeightUnit,
  ListExam,
  Patient,
  PatientStatus,
} from '../../state';
import { DatePipe } from '@angular/common';
import { HospitalPatientExamComponent } from '../exam/component';

@Component({
  selector: 'hospital-patient-view-exam',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [DatePipe, HospitalPatientExamComponent],
})
export class HospitalPatientViewExamComponent {
  @Input({ required: true }) exam!: ListExam;
  @Input({ required: true }) patient!: Patient;
  @Input({ required: true }) isVet!: boolean;

  editing = false;

  getSex = getSex;
  getWeightUnit = getWeightUnit;

  PatientStatus = PatientStatus;
}
