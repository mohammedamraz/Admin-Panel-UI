import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationEnd } from '@angular/router';

// services
import { AuthenticationService } from '../service/auth.service';
import { AdminConsoleService } from 'src/app/services/admin-console.service';
import { Observable, filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MultiAdminGuard implements CanActivate {
    constructor (
    private readonly adminService: AdminConsoleService,
    private router: Router,
        private authenticationService: AuthenticationService
    ) { }


    currentUrl: any = '';

    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot,
    ): boolean | Observable<boolean> {
      const currentUser = this.authenticationService.currentUser();
  
  
      if (!currentUser) {
        this.router.navigate(['orgLogin']);
        return false;
      }
  
      else {
        // this.router.events
        //   .pipe(filter((event) => event instanceof NavigationEnd))
        //   .subscribe(() => {
            this.currentUrl = state.url;

            
            
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser')!)
  
            if ((currentUser as any).org_data) {
              if ((currentUser as any).org_data[0].type === 'orgAdmin') {
                if(this.currentUrl.split('/')[1] != (currentUser as any).org_data[0].id)
              {
                this.router.navigate([(currentUser as any).org_data[0].id + '/' + this.currentUrl.split('/')[2] + '/' + this.currentUrl.split('/')[3]]);        
              return true;
              }
              else return true;
              } else if ((currentUser as any).org_data[0].type === 'admin'){
                // this.router.navigate(['/home']);
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
          // });
        // return true;
      }
    }
  }
    
    interface User { 
    org_data : any;
    }
    