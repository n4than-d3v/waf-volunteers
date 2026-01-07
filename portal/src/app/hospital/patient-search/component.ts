import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { searchPatient } from '../actions';
import { Observable } from 'rxjs';
import { Task } from '../state';
import { selectSearchPatient } from '../selectors';
import { SpinnerComponent } from '../../shared/spinner/component';

@Component({
  selector: 'hospital-patient-search',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, SpinnerComponent, FormsModule, ReactiveFormsModule],
})
export class HospitalPatientSearchComponent {
  search = '';

  task$: Observable<Task>;

  constructor(private store: Store) {
    this.task$ = this.store.select(selectSearchPatient);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.keyCode && event.keyCode == 13) {
      this.performSearch();
      event.preventDefault();
    }
  }

  performSearch() {
    this.store.dispatch(
      searchPatient({
        search: this.search,
      })
    );
    this.search = '';
  }
}
