export interface NoticeManagementState {
  notices: Notice[];
  interactions: Interaction[];
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

export const initialNoticeManagementState: NoticeManagementState = {
  notices: [],
  interactions: [],
  loading: false,
  error: false,
  created: false,
  updated: false,
  deleted: false,
};
