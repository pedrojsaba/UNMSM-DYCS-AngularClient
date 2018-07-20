import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppUserAuth } from './login.user.auth';
import { AppUser } from './login.user';
import { Observable, of } from 'rxjs';
import { AppUserClaim } from './login.user.claim';
import { JwtHelperService } from '@auth0/angular-jwt';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl + 'users/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})

export class SecurityService {
    securityObject: AppUserAuth = new AppUserAuth();
    jwtHelper: JwtHelperService = new JwtHelperService();

    constructor(private http: HttpClient) {
    }

    login(entity: AppUser): Observable<AppUserAuth> {

      this.resetSecurityObject();
        return this.http.post<AppUserAuth>(API_URL + 'login', entity, httpOptions).
          pipe(
            tap(resp => {
              Object.assign(this.securityObject, resp);
              localStorage.setItem('bearerToken', this.securityObject.bearerToken);
            })
          );
    }


    logout(): void {
      this.resetSecurityObject();
    }
    isAuthenticated(): boolean {
      const token = localStorage.getItem('bearerToken');
      if (token == null) {
          return false;
      }
      return this.jwtHelper.isTokenExpired(token) === false;
    }

    getUserName(): string {
      const token = localStorage.getItem('bearerToken');
      if (token == null) {
          return '';
      }
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.sub;
    }

    getTokenExpirationDate(): Date {
      const token = localStorage.getItem('bearerToken');
      if (token == null) {
          return null;
      }
      return this.jwtHelper.getTokenExpirationDate(token);
    }

    getClaims(): AppUserClaim[] {
      const claims: Array<AppUserClaim> = Array();
      const token = localStorage.getItem('bearerToken');
      if (token == null) {
          return [];
      }
      const decodedToken = this.jwtHelper.decodeToken(token);
      claims.push(new AppUserClaim('canAccessAccounts', decodedToken.canAccessAccounts));
      claims.push(new AppUserClaim('canAccessCustomers', decodedToken.canAccessCustomers));
      claims.push(new AppUserClaim('canAddAccount', decodedToken.canAddAccount));
      claims.push(new AppUserClaim('canAddCustomer', decodedToken.canAddCustomer));
      claims.push(new AppUserClaim('canSaveAccount', decodedToken.canSaveAccount));
      claims.push(new AppUserClaim('canSaveCustomer', decodedToken.canSaveCustomer));
      return claims;
    }

    resetSecurityObject(): void {
      localStorage.removeItem('bearerToken');
    }

    hasClaim(claimType: any, claimValue?: any) {
      let ret = false;
      if (typeof claimType === 'string') {
        ret = this.isClaimValid(claimType, claimValue);
      } else {
        const claims: string[] = claimType;
        if (claims) {
          for (let index = 0; index < claims.length; index++) {
            ret = this.isClaimValid(claims[index]);
            if (ret) {
              break;
            }
          }
        }
      }
      return ret;
    }

    private isClaimValid(claimType: string, claimValue?: string): boolean {
      let ret = false;
      if (claimType.indexOf(':') >= 0) {
        const words: string[] = claimType.split(':');
        claimType = words[0].toLowerCase();
        claimValue = words[1];
      } else {
        claimType = claimType.toLowerCase();
        claimValue = claimValue ? claimValue : 'true';
      }
      const claims = this.getClaims();
      ret = claims.find(c =>
        c.type.toLowerCase() === claimType &&
        c.value === claimValue) != null;
      return ret;
    }
}

