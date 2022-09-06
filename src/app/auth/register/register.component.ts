import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';

// service
import { AuthenticationService } from 'src/app/core/service/auth.service';

// types
import { User } from 'src/app/core/models/auth.models';
import { AdminConsoleService } from 'src/app/services/admin-console.service';

@Component({
  selector: 'app-auth-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  signUpForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
    ConfirmationCode: ['']
  });;
  formSubmitted: boolean = false;
  showPassword: boolean = false;
  loading: boolean = false;
  error: string = '';
  signUp:boolean = false;

  constructor (
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly adminService: AdminConsoleService,
    private cdr: ChangeDetectorRef,

  ) { }

  ngOnInit(): void {
  }

  /**
  * convenience getter for easy access to form fields
  */
  get formValues() {
    return this.signUpForm.controls;
  }


  /**
   * On form submit
   */
  onSubmit(): void {
    this.formSubmitted = true;
    this.error='';

    console.log('the ', this.signUpForm.value)

    if(this.signUp == false){
      if(this.signUpForm.value.password === this.signUpForm.value.confirmPassword ){
        this.adminService.signup({username:this.signUpForm.value.email,password:this.signUpForm.value.password,email:this.signUpForm.value.email})
        .subscribe({
          next: (data: any) => {
            console.log('there is a ssuucesesdf',data);
            this.signUp = true;
            
          },
          error: (error: string) => {
            this.error = error;
            this.cdr.detectChanges();
            this.signUp = true;
           }});
      }
      else{
        this.error = 'Invalid password'
      }
    }
    else{
      console.log('the vilayutu', this.signUpForm.value.ConfirmationCode)
      this.adminService.ConfirmSignup({username:this.signUpForm.value.email,password:this.signUpForm.value.password,email:this.signUpForm.value.email,ConfirmationCode: this.signUpForm.value.ConfirmationCode })
      .subscribe({
        next: (data: any) => {
          console.log('there is a ssuucesesdf',data);
          sessionStorage.setItem('currentUser', JSON.stringify(
            {id:1,username:"test",email:"adminto@coderthemes.com",password:"test",firstName:"Nowak",lastName:"Helme",avatar:"./assets/images/users/user-1.jpg",location:"California, USA",title:"Admin Head",name:"Nowak Helme",token:"fake-jwt-token",orglogin:true}
          ) );
// this.adminService.orgUserAdmin({username: this.formValues['email'].value, password: this.formValues['password'].value })
// have to give a route in place of error  when error is happening it should not route it should give registration succeful

          this.adminService.loginAdmin({username: this.signUpForm.value.email, password:this.signUpForm.value.password })
          .pipe(first())
          .subscribe({
           next: (data: any) => {
             console.log('there is a ssuucesesdf',data)
             sessionStorage.setItem('currentUser', JSON.stringify(
              {id:1,username:"test",email:"adminto@coderthemes.com",password:"test",firstName:"Nowak",lastName:"Helme",avatar:"./assets/images/users/user-1.jpg",location:"California, USA",title:"Admin Head",name:"Nowak Helme",token:"fake-jwt-token"}
            ) );
            this.router.navigate(['/orgdetails',data.user_data.id]);
            },
            error: (error: string) => {
              console.log('asdf',error)
              
              this.error = 'username or password is incorrect';
              this.loading = false;
              this.router.navigate(['/orgdetails',data.user_data.id]);
              this.error = 'User Registration is successfull, please use Vitals app to Sign In';
              // this.error = '';
              
            }});
            
          },
          error: (error: string) => {
            console.log('asdf',error)
            this.error = 'invalidcode';


         }});
    }

  }


}
