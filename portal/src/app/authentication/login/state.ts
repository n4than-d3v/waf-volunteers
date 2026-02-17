export interface LoginState {
  token: string | null;
  loading: boolean;
  error: boolean;
  errorMessage: string | null;
}

export const initialLoginState: LoginState = {
  token: null,
  loading: false,
  error: false,
  errorMessage: null,
};
