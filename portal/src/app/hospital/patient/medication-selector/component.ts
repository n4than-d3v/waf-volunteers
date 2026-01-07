import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { getMedications } from '../../actions';
import { Observable } from 'rxjs';
import { Medication, ReadOnlyWrapper } from '../../state';
import { selectMedications } from '../../selectors';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'hospital-patient-medication-selector',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, SpinnerComponent, FormsModule, ReactiveFormsModule],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class HospitalPatientMedicationSelectorComponent {
  @Input({ required: true }) id!: string;
  @Input({ required: true }) control!: string;
  @Input({ required: true }) formGroup!: FormGroup;

  search = '';
  open = false;

  medications$: Observable<ReadOnlyWrapper<Medication[]>>;

  medication: Medication | null = null;

  constructor(private store: Store) {
    this.medications$ = this.store.select(selectMedications);
  }

  private getFirstInList() {
    const first = document.querySelector(
      '#medication-selector ul li:first-child'
    ) as any;
    return first;
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.keyCode) {
      if (event.keyCode == 13 /* Enter */) {
        this.getFirstInList()?.click();
        event.preventDefault();
        return;
      } else if (
        event.keyCode == 40 /* Down */ ||
        event.keyCode == 9 /* Tab */
      ) {
        this.getFirstInList()?.focus();
        event.preventDefault();
        return;
      }
    }
  }

  onKeyUp(event: KeyboardEvent) {
    this.performSearch((event.target as any).value);
  }

  performSearch(search: string) {
    this.open = !!search;
    if (!search) return;
    this.store.dispatch(getMedications({ search }));
  }

  clearSelection(event: any) {
    if (event.keyCode && event.keyCode !== 13) return;
    this.medication = null;
    this.search = '';
    this.formGroup.controls[this.control].setValue('');
  }

  selectMedication(medication: Medication, event: any) {
    if (event.keyCode && event.keyCode !== 13) return;
    this.medication = medication;
    this.open = false;
    this.formGroup.controls[this.control].setValue(this.medication.id);
  }
}
