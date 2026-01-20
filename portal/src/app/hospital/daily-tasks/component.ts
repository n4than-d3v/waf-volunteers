import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  administerPrescriptionInstruction,
  administerPrescriptionMedication,
  performRecheck,
  setTab,
  viewDailyTasks,
} from '../actions';
import moment from 'moment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import {
  DailyTasksReport,
  DailyTasksReportAreaPenPatient,
  getRecheckRoles,
  getWeightUnit,
  ListRecheck,
  Prescription,
  PrescriptionMedication,
  ReadOnlyWrapper,
  Task,
} from '../state';
import { selectDailyTasksReport, selectPerformRecheck } from '../selectors';
import { AsyncPipe, DatePipe } from '@angular/common';
import { SpinnerComponent } from '../../shared/spinner/component';

@Component({
  selector: 'hospital-daily-tasks',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    DatePipe,
    SpinnerComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class HospitalDailyTasksComponent implements OnInit {
  dailyTasksReport$: Observable<ReadOnlyWrapper<DailyTasksReport>>;

  date: string = '';

  performRecheckTask$: Observable<Task>;

  performingRecheck: ListRecheck | null = null;
  administeringPrescription: Prescription | null = null;
  invalid: number | null = null;

  comments: any = {};
  weightValue: any = {};
  weightUnit: any = {};

  constructor(private store: Store) {
    this.dailyTasksReport$ = this.store.select(selectDailyTasksReport);
    this.performRecheckTask$ = this.store.select(selectPerformRecheck);
    this.date = moment().toISOString().split('T')[0];
  }

  changeDate() {
    this.store.dispatch(
      viewDailyTasks({
        date: this.date,
      }),
    );
  }

  ngOnInit() {
    this.changeDate();
  }

  viewPatient(reference: string, species: string, id: number) {
    this.store.dispatch(
      setTab({
        tab: {
          code: 'VIEW_PATIENT',
          title: `[${reference}] ${species}`,
          id: id,
        },
      }),
    );
  }

  cancel() {
    this.invalid = null;
    this.performingRecheck = null;
    this.administeringPrescription = null;
    this.comments = {};
    this.weightUnit = {};
    this.weightValue = {};
  }

  getRecheckRoles = getRecheckRoles;
  getWeightUnit = getWeightUnit;

  performRecheck(recheck: ListRecheck) {
    this.invalid = null;
    if (
      recheck.requireWeight &&
      !(this.weightUnit[recheck.id] && this.weightValue[recheck.id])
    ) {
      this.invalid = recheck.id;
      return;
    }
    this.store.dispatch(
      performRecheck({
        recheckId: recheck.id,
        date: this.date,
        comments: this.comments[recheck.id] || '',
        weightUnit: this.weightUnit[recheck.id]
          ? Number(this.weightUnit[recheck.id])
          : null,
        weightValue: this.weightValue[recheck.id]
          ? Number(this.weightValue[recheck.id])
          : null,
      }),
    );
    this.cancel();
  }
  administerInstruction(prescriptionInstructionId: number, success: boolean) {
    this.store.dispatch(
      administerPrescriptionInstruction({
        prescriptionInstructionId,
        date: this.date,
        comments: this.comments['I' + prescriptionInstructionId] || '',
        success,
      }),
    );
    this.cancel();
  }

  administerMedication(prescriptionMedicationId: number, success: boolean) {
    this.store.dispatch(
      administerPrescriptionMedication({
        prescriptionMedicationId,
        date: this.date,
        comments: this.comments['M' + prescriptionMedicationId] || '',
        success,
      }),
    );
    this.cancel();
  }

  getPrescriptions(patient: DailyTasksReportAreaPenPatient): Prescription[] {
    return [
      ...patient.prescriptionInstructions,
      ...patient.prescriptionMedications,
    ];
  }
  getMostRecent(prescription: Prescription) {
    if (prescription.administrations.length === 0) return '';
    return prescription.administrations[prescription.administrations.length - 1]
      .administered;
  }

  getDurationSinceMostRecent(prescription: Prescription) {
    const recent = this.getMostRecent(prescription);
    if (!recent) return '';

    const start = moment(recent);
    const end = moment();

    const duration = moment.duration(end.diff(start));

    // Total minutes, rounded
    const totalMinutes = Math.round(duration.asMinutes());
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;

    const formatted = [
      days ? `${days} day${days > 1 ? 's' : ''}` : null,
      hours ? `${hours} hour${hours > 1 ? 's' : ''}` : null,
      minutes ? `${minutes} minute${minutes > 1 ? 's' : ''}` : null,
    ]
      .filter(Boolean)
      .join(', ');

    return formatted || '0 minutes';
  }

  isPrescriptionMedication(p: Prescription): p is PrescriptionMedication {
    return 'medication' in p;
  }
}
