import { ProfilesState } from './admin/users/state';
import { ForgotPasswordState } from './authentication/forgot-password/state';
import { LoginState } from './authentication/login/state';
import { ResetPasswordState } from './authentication/reset-password/state';
import { ProfileState } from './volunteer/profile/state';

export interface AppState {
  login: LoginState;
  forgotPassword: ForgotPasswordState;
  resetPassword: ResetPasswordState;
  profile: ProfileState;

  // Admin
  profiles: ProfilesState;
}
