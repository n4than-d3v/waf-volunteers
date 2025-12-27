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
  roles: number;
  created: string;
  read: boolean;
  hasAttachments: boolean;
  attachments: NoticeAttachment[];
}

export interface NoticeAttachment {
  id: number;
  fileName: string;
  contentType: string;
}

export const initialNoticesState: NoticesState = {
  notices: [],
  notice: null,
  loading: false,
  error: false,
};
