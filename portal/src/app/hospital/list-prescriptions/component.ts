import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  Prescription,
  PrescriptionInstruction,
  PrescriptionMedication,
  ReadOnlyWrapper,
  Species,
  Task,
} from '../state';
import {
  selectAdministerPrescription,
  selectListPrescriptions,
} from '../selectors';
import {
  administerPrescriptionInstruction,
  administerPrescriptionMedication,
  listPrescriptions,
  setTab,
} from '../actions';
import { SpinnerComponent } from '../../shared/spinner/component';
import moment from 'moment';

@Component({
  selector: 'hospital-list-prescriptions',
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
export class HospitalListPrescriptions implements OnInit {
  date: string = '';
  viewingDate: string = '';

  listPrescriptions$: Observable<ReadOnlyWrapper<Prescription[]>>;

  task$: Observable<Task>;

  comments: any = {};

  isPrescriptionMedication(p: Prescription): p is PrescriptionMedication {
    return 'medication' in p;
  }

  constructor(private store: Store) {
    this.listPrescriptions$ = this.store.select(selectListPrescriptions);
    this.task$ = this.store.select(selectAdministerPrescription);
  }

  viewPatient(prescription: Prescription) {
    this.store.dispatch(
      setTab({
        tab: {
          code: 'VIEW_PATIENT',
          title: `[${prescription.reference}] ${prescription.species.name}`,
          id: prescription.viewPatientId,
        },
      })
    );
  }

  view() {
    this.viewingDate = this.date;
    this.store.dispatch(
      listPrescriptions({
        date: this.date,
      })
    );
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

  administerInstruction(prescriptionInstructionId: number, success: boolean) {
    this.store.dispatch(
      administerPrescriptionInstruction({
        prescriptionInstructionId,
        date: this.viewingDate,
        comments: this.comments['I' + prescriptionInstructionId],
        success,
      })
    );
    this.comments = {};
  }

  administerMedication(prescriptionMedicationId: number, success: boolean) {
    this.store.dispatch(
      administerPrescriptionMedication({
        prescriptionMedicationId,
        date: this.viewingDate,
        comments: this.comments['M' + prescriptionMedicationId],
        success,
      })
    );
    this.comments = {};
  }

  ngOnInit() {
    this.date = new Date().toISOString().split('T')[0];
    this.view();
  }
}
