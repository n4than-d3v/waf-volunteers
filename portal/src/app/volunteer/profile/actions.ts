import { createAction, props } from '@ngrx/store';
import { Profile } from './state';

export const getCurrentProfile = createAction(
  '[Volunteer] Get Current Profile'
);
export const getCurrentProfileSuccess = createAction(
  '[Volunteer] Get Current Profile: Success',
  props<{ profile: Profile }>()
);
export const getCurrentProfileError = createAction(
  '[Volunteer] Get Current Profile: Error'
);
export const updateCurrentProfile = createAction(
  '[Volunteer] Update Current Profile',
  props<{ profile: Profile }>()
);
export const updateCurrentProfileSuccess = createAction(
  '[Volunteer] Update Current Profile: Success'
);
export const updateCurrentProfileError = createAction(
  '[Volunteer] Update Current Profile: Error'
);
export const updateSubscription = createAction(
  '[Volunteer] Update Subscription',
  props<{ subscription: PushSubscription }>()
);
