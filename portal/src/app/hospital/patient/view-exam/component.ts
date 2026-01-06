import { Component, Input } from '@angular/core';
import {
  getSex,
  getTemperatureUnit,
  getWeightUnit,
  ListExam,
  Patient,
  PatientStatus,
} from '../../state';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'hospital-patient-view-exam',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [DatePipe],
})
export class HospitalPatientViewExamComponent {
  @Input({ required: true }) exam!: ListExam;

  getSex = getSex;
  getWeightUnit = getWeightUnit;
  getTemperatureUnit = getTemperatureUnit;
}
