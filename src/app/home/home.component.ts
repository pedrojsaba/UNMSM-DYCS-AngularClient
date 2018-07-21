import { Component, OnInit } from '@angular/core';
import { AppUserClaim } from './login.user.claim';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  jwtHelper: JwtHelperService = new JwtHelperService();
  claims: Array<AppUserClaim> = Array();

  constructor(private router: Router) { }

  ngOnInit() {
    this.claims = this.getClaims();
    if (this.claims==[]){
      this.router.navigateByUrl('login');
    }
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
}
