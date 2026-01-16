import { AdminHospitalManagementState } from './admin/hospital/state';
import { NoticeManagementState } from './admin/notices/state';
import { RotaManagementState } from './admin/rota/state';
import { ProfilesState } from './admin/users/state';
import { ForgotPasswordState } from './authentication/forgot-password/state';
import { LoginState } from './authentication/login/state';
import { ResetPasswordState } from './authentication/reset-password/state';
import { ClockingState } from './clocking/state';
import { HospitalState } from './hospital/state';
import { HospitalStockState } from './hospital/stock/state';
import { OrphanFeederState } from './volunteer/home-care/state';
import { NoticesState } from './volunteer/notices/state';
import { ProfileState } from './volunteer/profile/state';
import { RotaState } from './volunteer/rota/state';

export interface AppState {
  login: LoginState;
  forgotPassword: ForgotPasswordState;
  resetPassword: ResetPasswordState;
  profile: ProfileState;
  rota: RotaState;
  notices: NoticesState;
  orphanFeeder: OrphanFeederState;

  // Admin
  profiles: ProfilesState;
  rotaManagement: RotaManagementState;
  noticeManagement: NoticeManagementState;
  adminHospitalManagement: AdminHospitalManagementState;

  // Hospital
  hospital: HospitalState;
  hospitalStock: HospitalStockState;

  // Clocking
  clocking: ClockingState;
}
