import { Component, Input } from '@angular/core';
import { getSex, getWeightUnit, ListExam } from '../../state';
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
  @Input({ required: true }) isVet!: boolean;

  getSex = getSex;
  getWeightUnit = getWeightUnit;
}
