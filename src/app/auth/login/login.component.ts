import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';

// service
import { AuthenticationService } from 'src/app/core/service/auth.service';

// types
import { User } from 'src/app/core/models/auth.models';
import { AdminConsoleService } from 'src/app/services/admin-console.service';

@Component({
  selector: 'app-auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = this.fb.group({
    email: ['vomahol122@esmoud.com', [Validators.required,]],
    password: ['Gowda@967', Validators.required],
    rememberMe:[true]
  });
  formSubmitted: boolean = false;
  error: string = '';
  returnUrl: string = '/';
  loading: boolean = false;

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
      // this.loading = true;

// check if this is the url we are saving for the org login
// this.adminService.orgUserAdmin({username: this.formValues['email'].value, password: this.formValues['password'].value })

      this.adminService.loginAdmin({username: this.formValues['email'].value, password: this.formValues['password'].value })
      .pipe(first())
      .subscribe({
       next: (data: any) => {
         console.log('there is a ssuucesesdf',data)
        if(this.formValues['rememberMe'].value){
          localStorage.setItem("currentUser", JSON.stringify(data))
          sessionStorage.setItem('currentUser', JSON.stringify(data) );
        }
        else{
          sessionStorage.setItem('currentUser', JSON.stringify(data));
        }
         this.router.navigate(['/home']);
        },
        error: (error: string) => {
          console.log('asdf',error)
          this.error = 'invalid username or password';
        }});


    }
  }


}
