import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationEnd } from '@angular/router';

// services
import { AuthenticationService } from '../service/auth.service';
import { AdminConsoleService } from 'src/app/services/admin-console.service';
import { Observable, filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor (
    private readonly adminService: AdminConsoleService,
    private router: Router,
        private authenticationService: AuthenticationService
    ) { }



    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
      ): boolean | Observable<boolean> {
        const currentUser = this.authenticationService.currentUser();
    
        if (!currentUser){
          this.router.navigate(['error-404']);

          return false;
        }
        else if ((currentUser as any).org_data) {
          if ((currentUser as any).org_data[0].type === 'orgAdmin') {
            this.router.navigate([(currentUser as any).org_data[0].id + '/dashboard']);
            return true;
          } else if ((currentUser as any).org_data[0].type === 'admin'){
            return true;
          }
          else { 
            this.router.navigate(['error-404']);
            return false;
          }
        } else if ((currentUser as any).user_data) {
          this.adminService
            .fetchUserProdById((currentUser as any).user_data[0].id)
            .subscribe({
              next: (res: any) => {
                this.router.navigate([
                  (currentUser as any).user_data[0].id +
                    '/userdashboard/' +
                    res[0].product_id,
                ]);
              },
            });
          return true; 
        } else {
          return false;
        }
      }
    }

interface User { 
    org_data : any;
}