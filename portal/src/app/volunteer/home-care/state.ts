import {
  createReadOnlyWrapper,
  createTask,
  HomeCareMessage,
  HomeCareRequest,
  ReadOnlyWrapper,
  Task,
} from '../../hospital/state';

export interface OrphanFeederState {
  outstandingRequests: ReadOnlyWrapper<HomeCareRequest[]>;
  myActiveRequests: ReadOnlyWrapper<HomeCareRequest[]>;
  messages: ReadOnlyWrapper<HomeCareMessage[]>;
  acceptRequest: Task;
  sendMessage: Task;
}

export const initialOrphanFeederState: OrphanFeederState = {
  outstandingRequests: createReadOnlyWrapper<HomeCareRequest[]>(),
  myActiveRequests: createReadOnlyWrapper<HomeCareRequest[]>(),
  messages: createReadOnlyWrapper<HomeCareMessage[]>(),
  acceptRequest: createTask(),
  sendMessage: createTask(),
};
