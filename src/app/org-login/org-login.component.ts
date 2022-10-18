import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first, ReplaySubject } from 'rxjs';
import { AuthenticationService } from '../core/service/auth.service';
import { AdminConsoleService } from '../services/admin-console.service';

@Component({
  selector: 'app-org-login',
  templateUrl: './org-login.component.html',
  styleUrls: ['./org-login.component.scss']
})
export class OrgLoginComponent implements OnInit {
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required,]],
    password: ['', Validators.required],
    rememberMe:[true]
  });
  formSubmitted: boolean = false;
  error: string = '';
  returnUrl: string = '/';
  loading: boolean = false;
  public httpLoading$ = new ReplaySubject<boolean>(1);


  constructor (
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private fb: FormBuilder,
    private readonly adminService: AdminConsoleService,
    private adminConsoleService: AdminConsoleService


  ) { }

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || this.returnUrl;
  }

  /**
   * convenience getter for easy access to form fields
   */
  get formValues() { return this.loginForm.controls; }

  /**
  * On submit form
  */
  onSubmit(): void {
    // this.router.navigate([`${1}/dashboard`]);

    // this.error='';
    this.formSubmitted = true;
    if (this.loginForm.valid) {
      // this.loading = true;

      this.adminService.orgAdmin({username: this.formValues['email'].value, password: this.formValues['password'].value })
      .pipe(first())
      .subscribe({
       next: (data: any) => {
         console.log('there is a ssuucesesdf',data);
        if(data.hasOwnProperty('user_data')){
          data['orglogin']=false;
          if(this.formValues['rememberMe'].value){
            localStorage.setItem("currentUser", JSON.stringify(data))
            sessionStorage.setItem('currentUser', JSON.stringify(data) );
          }
          else{
            sessionStorage.setItem('currentUser', JSON.stringify(data) );
          }
          this.adminConsoleService.httpLoading$.next(true);
          this.adminService.fetchUserProdById(data.user_data[0].id).subscribe({
            next:(res:any) =>{
              this.router.navigate([`${data.hasOwnProperty('user_data')? data.user_data[0].org_id+'/userdashboard/'+res[0].product_id : data.org_data[0].id+'/dashboard' }`]);
            }})
        }
        else if(data.org_data[0].type != 'admin'){
          data['orglogin']=true;
          if(this.formValues['rememberMe'].value){
            localStorage.setItem("currentUser", JSON.stringify(data))
            sessionStorage.setItem('currentUser', JSON.stringify(data) );
          }
          else{
            sessionStorage.setItem('currentUser', JSON.stringify(data) );
          }
          this.adminConsoleService.httpLoading$.next(true);
          this.router.navigate([`${data.hasOwnProperty('user_data')? data.user_data[0].org_id : data.org_data[0].id }/dashboard`]);
        } 
        else { console.log("super admin");
                  this.error = 'Invalid email or password';}

        
        },
        error: (error: string) => {
          
          this.error = 'Invalid email or password';

        }});




    }
  }


}
