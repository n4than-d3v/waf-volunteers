export interface ForgotPasswordState {
  loading: boolean;
  complete: boolean;
  error: boolean;
}

export const initialForgotPasswordState: ForgotPasswordState = {
  loading: false,
  complete: false,
  error: false,
};
