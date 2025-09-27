export interface ResetPasswordState {
  loading: boolean;
  complete: boolean;
  error: boolean;
}

export const initialForgotPasswordState: ResetPasswordState = {
  loading: false,
  complete: false,
  error: false,
};
