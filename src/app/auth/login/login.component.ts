import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';

// service
import { AuthenticationService } from 'src/app/core/service/auth.service';

// types
import { AdminConsoleService } from 'src/app/services/admin-console.service';

@Component({
  selector: 'app-auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required,Validators.pattern("^\\s{0,}?[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,7}\\s{0,}?$")]],
    password: ['', Validators.required,],
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
      this.adminService.orgAdmin({username: this.formValues['email'].value, password: this.formValues['password'].value })
      .pipe(first())
      .subscribe({
       next: (data: any) => {
        this.authenticationService.logout();
         if(data.org_data[0].type === 'admin'){
          if(this.formValues['rememberMe'].value){
          localStorage.setItem("currentUser", JSON.stringify(data))
          sessionStorage.setItem('currentUser', JSON.stringify(data) );
           }
          else{
          sessionStorage.setItem('currentUser', JSON.stringify(data));
          }
         this.router.navigate(['/home']);
        }
        else{
          this.error = 'Invalid email or password';

        }
      },
        error: (error: string) => {
          this.error = 'Invalid email or password';
        }});


    }
  }


}
