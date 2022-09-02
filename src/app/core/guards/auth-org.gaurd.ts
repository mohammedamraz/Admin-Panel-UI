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
        private adminConsoleService: AdminConsoleService,
        
        ) { }
        
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log('hi macha')
        const currentUser = this.authenticationService.currentUser();

        if (false) {
            return true;
        }

        //need to implement decription
        let snapshotParam:any =route.paramMap.get("id");
        this.adminConsoleService.fetchOrgById(snapshotParam).subscribe({
            next: (res) => {
              console.log('the success=>',res);
              //check if user is registered  
              if(true) {
                  this.router.navigate(['./auth/orgLogin'], { queryParams: { returnUrl: state.url } });
                }
      
            this.router.navigate(['./auth/register'], { queryParams: { returnUrl: state.url } });
              
   
            },
            error: (err) => {
              console.log('the failure=>',err);

            },
            complete: () => { }
          });

        // not logged in so redirect to login page with the return url
        this.router.navigate(['./auth/orgLogin'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}