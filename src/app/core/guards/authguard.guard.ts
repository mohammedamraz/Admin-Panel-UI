import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../service/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthguardGuard implements CanActivate {
    constructor (
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }



    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUser();
        
        if (currentUser) {
            return true;
        }

        this.router.navigate(['orgLogin']);
        return false;
    }
}