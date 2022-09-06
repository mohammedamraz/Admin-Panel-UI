import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AdminConsoleService } from 'src/app/services/admin-console.service';
import * as Forge from 'node-forge';

// services
import { AuthenticationService } from '../service/auth.service';
import { PRIVATE_KEY } from 'src/app/constants/keys';

@Injectable({ providedIn: 'root' })
export class AuthOrgGuard implements CanActivate {
    constructor (
        private router: Router,
        private authenticationService: AuthenticationService,
        private adminConsoleService: AdminConsoleService,
        
        ) { }
        
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const privateKey = Forge.pki.privateKeyFromPem(PRIVATE_KEY);
        const currentUser = this.authenticationService.currentUser();
        

        if (false) {
            return true;
        }

        //need to implement decription
        let snapshotParam:any =JSON.parse(privateKey.decrypt(Forge.util.decode64(decodeURIComponent(Object.keys(route.queryParams)[0])), 'RSA-OAEP')).user_id
        this.adminConsoleService.fetchOrgById(snapshotParam).subscribe({
            next: (res:any) => {
              if(res[0].is_register) {
                  this.router.navigate(['./auth/orgLogin'], );
            }
            else{
                this.router.navigate(['./auth/register']);
                }
            },
            error: (err) => {
              console.log('the failure=>',err);
            },
            complete: () => { }
          });
          this.router.navigate(['./auth/orgLogin'], );


        return false;
    }
}