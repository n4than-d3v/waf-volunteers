import { Component, Input } from '@angular/core';
import {
  ListBloodTest,
  ListNote,
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
  downloadNoteAttachment,
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
  addingBlood = false;
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
      })
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
      })
    );
    this.reset();
  }

  download(
    bloodTest: ListBloodTest,
    attachment: { id: number; fileName: string }
  ) {
    this.store.dispatch(
      downloadBloodTestAttachment({
        patientId: this.patient.id,
        bloodTestId: bloodTest.id,
        attachment,
      })
    );
  }

  reset() {
    this.saving = false;
    this.addingFaecal = false;
    this.addingBlood = false;
    this.faecalForm.reset();
    this.bloodForm.reset();
  }
}
