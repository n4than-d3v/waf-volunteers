import { Component, Input } from '@angular/core';
import {
  ListBloodTest,
  ListFaecalTest,
  Patient,
  PatientStatus,
  Task,
} from '../../state';
import { AsyncPipe, DatePipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  addBloodTest,
  addFaecalTest,
  downloadBloodTestAttachment,
  removeBloodTest,
  removeFaecalTest,
  updateBloodTest,
  updateFaecalTest,
} from '../../actions';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { Observable } from 'rxjs';
import { selectAddLabs } from '../../selectors';

@Component({
  selector: 'hospital-patient-labs',
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
export class HospitalPatientLabsComponent {
  @Input({ required: true }) patient!: Patient;
  @Input({ required: true }) isVet!: boolean;

  task$: Observable<Task>;

  constructor(private store: Store) {
    this.task$ = this.store.select(selectAddLabs);
  }

  PatientStatus = PatientStatus;

  addingFaecal = false;
  updatingFaecal: number | null = null;
  addingBlood = false;
  updatingBlood: number | null = null;
  saving = false;

  faecalForm = new FormGroup({
    float: new FormControl<'' | 'P' | 'N'>(''),
    direct: new FormControl<'' | 'P' | 'N'>(''),
    comments: new FormControl(''),
  });

  bloodForm = new FormGroup({
    comments: new FormControl(''),
    files: new FormControl<File[] | null>(null),
  });

  formatPosNeg(value: boolean | null) {
    if (value == null) return '';
    if (value == true) return 'Positive';
    if (value == false) return 'Negative';
    return 'Unknown';
  }

  onFileChange(event: any) {
    const files = event.target.files as FileList;
    this.bloodForm.controls.files.setValue(Array.from(files));
  }

  prepareEditFaecalTest(test: ListFaecalTest) {
    this.updatingFaecal = test.id;
    this.faecalForm.patchValue({
      float: test.float != null ? (test.float! ? 'P' : 'N') : null,
      direct: test.direct != null ? (test.direct! ? 'P' : 'N') : null,
      comments: test.comments,
    });
  }

  updateFaecalTest() {
    this.saving = true;
    const float = this.faecalForm.value.float || '';
    const direct = this.faecalForm.value.direct || '';
    this.store.dispatch(
      updateFaecalTest({
        id: this.updatingFaecal!,
        patientId: this.patient.id,
        float: float ? float === 'P' : null,
        direct: direct ? direct === 'P' : null,
        comments: this.faecalForm.value.comments || '',
      }),
    );
    this.reset();
  }

  removeFaecalTest(test: ListFaecalTest) {
    this.store.dispatch(
      removeFaecalTest({
        id: test.id,
        patientId: this.patient.id,
      }),
    );
    this.reset();
  }

  prepareEditBloodTest(test: ListBloodTest) {
    this.updatingBlood = test.id;
    this.bloodForm.patchValue({
      comments: test.comments,
    });
  }

  updateBloodTest() {
    this.saving = true;
    this.store.dispatch(
      updateBloodTest({
        id: this.updatingBlood!,
        patientId: this.patient.id,
        comments: this.bloodForm.value.comments || '',
      }),
    );
    this.reset();
  }

  removeBloodTest(test: ListBloodTest) {
    this.store.dispatch(
      removeBloodTest({
        id: test.id,
        patientId: this.patient.id,
      }),
    );
    this.reset();
  }

  addFaecalTest() {
    this.saving = true;
    const float = this.faecalForm.value.float || '';
    const direct = this.faecalForm.value.direct || '';
    this.store.dispatch(
      addFaecalTest({
        patientId: this.patient.id,
        float: float ? float === 'P' : null,
        direct: direct ? direct === 'P' : null,
        comments: this.faecalForm.value.comments || '',
      }),
    );
    this.reset();
  }

  addBloodTest() {
    this.saving = true;
    this.store.dispatch(
      addBloodTest({
        patientId: this.patient.id,
        comments: this.bloodForm.value.comments || '',
        files: this.bloodForm.value.files || [],
      }),
    );
    this.reset();
  }

  download(
    bloodTest: ListBloodTest,
    attachment: { id: number; fileName: string },
  ) {
    this.store.dispatch(
      downloadBloodTestAttachment({
        patientId: this.patient.id,
        bloodTestId: bloodTest.id,
        attachment,
      }),
    );
  }

  reset() {
    this.saving = false;
    this.addingFaecal = false;
    this.addingBlood = false;
    this.updatingBlood = null;
    this.updatingFaecal = null;
    this.faecalForm.reset();
    this.bloodForm.reset();
  }
}
