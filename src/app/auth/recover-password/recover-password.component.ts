import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminConsoleService } from 'src/app/services/admin-console.service';
import { first } from 'rxjs';


@Component({
  selector: 'app-auth-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {

  resetPassswordForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],

  });

  resetForm: FormGroup = this.fb.group({
    email:[''],
    password:['',[Validators.required]],
    confirmPassword:['',[Validators.required]],
    ConfirmationCode:['',[Validators.required]]
  });
  formSubmitted: boolean = false;
  orgLogin: boolean = false;
  successMessage?: string = "";
  titleString?: string = "Enter your email address and we'll send you an email with Confirmation Code  to  reset  your password. ";

  constructor (
    private fb: FormBuilder,
    private readonly adminService: AdminConsoleService,
    private router: Router,


  ) { }

  ngOnInit(): void {

  }

  /**
  * convenience getter for easy access to form fields
  */
  get formValues() {
    return this.resetPassswordForm.controls;
  }
  
  get resetFormValues(){    
    return this.resetForm.controls;
  }

  /**
   * On form submit
   */
  onSubmit(): void {
    console.log('the for valid', this.formValues['email'].invalid)
    this.formSubmitted = true;
    if(this.orgLogin == false){
      this.adminService.forgotPassword({username: this.resetForm.value.email})
      .pipe(first())
      .subscribe({
       next: (data: any) => {
        this.orgLogin = true;
          this.successMessage = "We have sent you an email containing a link to reset your password";
          this.titleString =''
        //  this.router.navigate(['/home']);
        },
        error: (error: string) => {
          // this.orgLogin = true;
          // this.formSubmitted = true;
          console.log('the error =>',error);
          this.successMessage = error;
          this.titleString =''

  
        }});
    }
    else{
      if(this.resetFormValues['password'].value === this.resetFormValues['confirmPassword'].value){
        this.adminService.confirmPassword({username: this.resetForm.value.email,password:this.resetForm.value.password,ConfirmationCode: this.resetForm.value.ConfirmationCode})
      .pipe(first())
      .subscribe({
       next: (data: any) => {
        this.orgLogin = true;
        this.router.navigate(['./auth/orgLogin'], );

        },
        error: (error: string) => {
          // this.orgLogin = true;
          // this.formSubmitted = true;
          console.log('the error =>',error);
          this.successMessage = error;
          this.titleString =''
          // this.router.navigate(['./auth/orgLogin'], );

  
        }});
      }

      else{
        this.successMessage = 'Confirm password should be same as create Password'
      }

    }



  }



}
