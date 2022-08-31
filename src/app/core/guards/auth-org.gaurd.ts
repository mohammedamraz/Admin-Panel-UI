import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AdminConsoleService } from 'src/app/services/admin-console.service';

// services
import { AuthenticationService } from '../service/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthOrgGuard implements CanActivate {
    constructor (
        private router: Router,
        private authenticationService: AuthenticationService,
        private adminConsoleService: AdminConsoleService
        ) { }
        
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log('hi macha')
        const currentUser = this.authenticationService.currentUser();

        if (false) {
            return true;
        }


        // not logged in so redirect to login page with the return url
        this.adminConsoleService.httpLoading$.next(false);
        this.router.navigate(['./auth/orgLogin'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}