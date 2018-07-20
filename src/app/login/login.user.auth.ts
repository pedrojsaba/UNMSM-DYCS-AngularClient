import { AppUserClaim } from './login.user.claim';

export class AppUserAuth {
  name = '';
  bearerToken = '';
  isAuthenticated = false;
  claims: AppUserClaim[] = [];
}
