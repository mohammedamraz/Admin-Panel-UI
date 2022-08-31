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
    password: ['', Validators.required]
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
    this.formSubmitted = true;
    if (this.loginForm.valid) {
      this.loading = true;

      this.adminService.orgAdmin({username: this.formValues['email'].value, password: this.formValues['password'].value })
      .pipe(first())
      .subscribe({
       next: (data: any) => {
         console.log('there is a ssuucesesdf',data)
         sessionStorage.setItem('currentUser', JSON.stringify(
          {id:1,username:"test",email:"adminto@coderthemes.com",password:"test",firstName:"Nowak",lastName:"Helme",avatar:"./assets/images/users/user-1.jpg",location:"California, USA",title:"Admin Head",name:"Nowak Helme",token:"fake-jwt-token"}
        ) );
         this.router.navigate(['/orgdetails',7]);
        },
        error: (error: string) => {
          sessionStorage.setItem('currentUser', JSON.stringify(
            {id:1,username:"test",email:"adminto@coderthemes.com",password:"test",firstName:"Nowak",lastName:"Helme",avatar:"./assets/images/users/user-1.jpg",location:"California, USA",title:"Admin Head",name:"Nowak Helme",token:"fake-jwt-token"}
          ) );
          this.router.navigate(['/orgdetails',7]);

          console.log('asdf',error)
          this.error = 'username or password is incorrect';
          this.loading = false;
        }});




    }
  }


}
