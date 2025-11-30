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
  created: string;
  read: boolean;
}

export const initialNoticesState: NoticesState = {
  notices: [],
  notice: null,
  loading: false,
  error: false,
};
