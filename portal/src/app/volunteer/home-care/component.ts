import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  HomeCareMessage,
  HomeCareRequest,
  ReadOnlyWrapper,
  Task,
} from '../../hospital/state';
import {
  selectAcceptHomeCareRequest,
  selectHomeCareMessages,
  selectMyActiveHomeCareRequests,
  selectOutstandingHomeCareRequests,
  selectSendHomeCareMessage,
} from './selectors';
import {
  acceptHomeCareRequest,
  getHomeCareMessages,
  getMyActiveHomeCareRequests,
  getOutstandingHomeCareRequests,
  sendHomeCareMessage,
} from './actions';
import { AsyncPipe, DatePipe } from '@angular/common';
import { SpinnerComponent } from '../../shared/spinner/component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'volunteer-home-care',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    DatePipe,
    SpinnerComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
})
export class VolunteerHomeCareComponent implements OnInit {
  outstanding$: Observable<ReadOnlyWrapper<HomeCareRequest[]>>;
  active$: Observable<ReadOnlyWrapper<HomeCareRequest[]>>;
  messages$: Observable<ReadOnlyWrapper<HomeCareMessage[]>>;

  acceptRequest$: Observable<Task>;
  sendMessage$: Observable<Task>;

  accepting: number | null = null;
  acceptForm = new FormGroup({
    pickupDate: new FormControl('', [Validators.required]),
    pickupTime: new FormControl('', [Validators.required]),
  });

  viewingMessages: number | null = null;
  messageForm = new FormGroup({
    message: new FormControl('', [Validators.required]),
  });

  saving = false;
  attemptedSave = false;

  constructor(private store: Store) {
    this.outstanding$ = this.store.select(selectOutstandingHomeCareRequests);
    this.active$ = this.store.select(selectMyActiveHomeCareRequests);
    this.messages$ = this.store.select(selectHomeCareMessages);
    this.acceptRequest$ = this.store.select(selectAcceptHomeCareRequest);
    this.sendMessage$ = this.store.select(selectSendHomeCareMessage);
  }

  reset() {
    this.saving = false;
    this.accepting = null;
    this.attemptedSave = false;
    this.acceptForm.reset();
    this.messageForm.reset();
  }

  accept() {
    this.attemptedSave = true;
    if (!this.acceptForm.valid) return;
    this.saving = true;
    this.store.dispatch(
      acceptHomeCareRequest({
        homeCareRequestId: Number(this.accepting!),
        pickup:
          this.acceptForm.value.pickupDate! +
          'T' +
          this.acceptForm.value.pickupTime! +
          'Z',
      })
    );
    this.reset();
  }

  openMessages(homeCareRequestId: number) {
    this.viewingMessages = homeCareRequestId;
    this.store.dispatch(
      getHomeCareMessages({
        homeCareRequestId,
      })
    );
  }

  sendMessage() {
    this.attemptedSave = true;
    if (!this.messageForm.valid) return;
    this.saving = true;
    this.store.dispatch(
      sendHomeCareMessage({
        homeCareRequestId: this.viewingMessages!,
        message: this.messageForm.value.message!,
      })
    );
    this.reset();
  }

  ngOnInit() {
    this.store.dispatch(getOutstandingHomeCareRequests());
    this.store.dispatch(getMyActiveHomeCareRequests());
  }
}
