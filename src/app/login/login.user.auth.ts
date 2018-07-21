import { AppUserClaim } from './login.user.claim';

export class AppUserAuth {
  id = 0;
  name = '';
  bearToken = '';
  authenticated = false;
  claims: AppUserClaim[] = [];
}
