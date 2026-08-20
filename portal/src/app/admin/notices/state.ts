export interface NoticeManagementState {
  notices: Notice[];
  interactions: Interaction[];
  interactionSummary: InteractionSummary[];
  questionResponses: QuestionResponses;
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

export interface QuestionResponses {
  questions: {
    id: number;
    title: string;
    answers: { [id: string]: number };
  }[];
  users: { name: string; answers: { [id: number]: string[] } }[];
}

export const initialNoticeManagementState: NoticeManagementState = {
  notices: [],
  interactions: [],
  interactionSummary: [],
  questionResponses: {
    questions: [],
    users: [],
  },
  loading: false,
  error: false,
  created: false,
  updated: false,
  deleted: false,
};
