export interface LoginState {
  token: string | null;
  loading: boolean;
  error: boolean;
}

export const initialLoginState: LoginState = {
  token: null,
  loading: false,
  error: false,
};
