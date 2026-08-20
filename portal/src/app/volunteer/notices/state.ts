export interface NoticesState {
  notices: Notice[];
  notice: Notice | null;
  loading: boolean;
  error: boolean;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  sendAt: string | null;
  sent: boolean;
  roles: number;
  created: string;
  read: boolean;
  hasAttachments: boolean;
  attachments: NoticeAttachment[];
  questions: NoticeQuestion[];
  responses: NoticeResponse[];
}

export interface NoticeAttachment {
  id: number;
  fileName: string;
  contentType: string;
}

export interface NoticeQuestion {
  title: string;
  allowMultiple: boolean;
  allowOther: boolean;
  answers: string[];
  id: number;
}

export interface NoticeResponse {
  responded: string;
  answers: string[];
  viewQuestionId: number;
}

export const initialNoticesState: NoticesState = {
  notices: [],
  notice: null,
  loading: false,
  error: false,
};
