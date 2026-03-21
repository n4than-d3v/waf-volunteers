import { createAction, props } from '@ngrx/store';
import { HomeCareMessage, HomeCareRequest } from '../../hospital/state';

export const getOutstandingHomeCareRequests = createAction(
  '[HMS-O] Get outstanding home care requests',
);
export const getOutstandingHomeCareRequestsSuccess = createAction(
  '[HMS-O] Get outstanding home care requests: success',
  props<{ requests: HomeCareRequest[] }>(),
);
export const getOutstandingHomeCareRequestsError = createAction(
  '[HMS-O] Get outstanding home care requests: error',
);

export const acceptHomeCareRequest = createAction(
  '[HMS-O] Accept home care request',
  props<{ homeCareRequestId: number; pickup: string }>(),
);
export const acceptHomeCareRequestSuccess = createAction(
  '[HMS-O] Accept home care request: success',
);
export const acceptHomeCareRequestError = createAction(
  '[HMS-O] Accept home care request: error',
);

export const getMyActiveHomeCareRequests = createAction(
  '[HMS-O] Get my active home care requests',
);
export const getMyActiveHomeCareRequestsSuccess = createAction(
  '[HMS-O] Get my active home care requests: success',
  props<{ requests: HomeCareRequest[] }>(),
);
export const getMyActiveHomeCareRequestsError = createAction(
  '[HMS-O] Get my active home care requests: error',
);

export const sendHomeCareMessage = createAction(
  '[HMS-O] Send home care message',
  props<{
    homeCareRequestId: number;
    message: string;
    weightValue: number | null;
    weightUnit: number | null;
    files: File[];
  }>(),
);
export const sendHomeCareMessageSuccess = createAction(
  '[HMS-O] Send home care message: success',
  props<{ homeCareRequestId: number }>(),
);
export const sendHomeCareMessageError = createAction(
  '[HMS-O] Send home care message: error',
);

export const downloadHomeCareMessageAttachment = createAction(
  '[HMS-O] Download home care message attachment',
  props<{
    messageId: number;
    attachment: {
      id: number;
      fileName: string;
    };
  }>(),
);

export const getHomeCareMessages = createAction(
  '[HMS-O] Get home care messages',
  props<{ homeCareRequestId: number }>(),
);
export const getHomeCareMessagesSuccess = createAction(
  '[HMS-O] Get home care messages: success',
  props<{ messages: HomeCareMessage[] }>(),
);
export const getHomeCareMessagesError = createAction(
  '[HMS-O] Get home care messages: error',
);
