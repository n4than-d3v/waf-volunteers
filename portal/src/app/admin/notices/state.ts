export interface NoticeManagementState {
  notices: Notice[];
  interactions: Interaction[];
  interactionSummary: InteractionSummary[];
  loading: boolean;
  error: boolean;
  created: boolean;
  updated: boolean;
  deleted: boolean;
}

export interface Notice {
  id: number;
  title: string;
  created: string;
  sendAt: string;
  sent: boolean;
}

export interface Interaction {
  name: string;
  read: boolean;
  interactions: {
    opened: string;
    closed: string | null;
    duration: string | null;
    durationSeconds: number | null;
  }[];
}

export interface InteractionSummary {
  id: number;
  name: string;
  total: number;
  read: number;
  unread: number;
}

export const initialNoticeManagementState: NoticeManagementState = {
  notices: [],
  interactions: [],
  interactionSummary: [],
  loading: false,
  error: false,
  created: false,
  updated: false,
  deleted: false,
};
