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
    email: ['', [Validators.required, Validators.email]]
  });
  formSubmitted: boolean = false;
  successMessage?: string;

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

  /**
   * On form submit
   */
  onSubmit(): void {

    this.adminService.forgetPassword({email: this.formValues['email'].value})
    .pipe(first())
    .subscribe({
     next: (data: any) => {
      //  console.log('there is a ssuucesesdf',data)
      //  sessionStorage.setItem('currentUser', JSON.stringify(
      //   {id:1,username:"test",email:"adminto@coderthemes.com",password:"test",firstName:"Nowak",lastName:"Helme",avatar:"./assets/images/users/user-1.jpg",location:"California, USA",title:"Admin Head",name:"Nowak Helme",token:"fake-jwt-token"}
      // ) );
      this.formSubmitted = true;
      if (this.resetPassswordForm.valid) {
        this.successMessage = "We have sent you an email containing a link to reset your password";
      }
      //  this.router.navigate(['/home']);
      },
      error: (error: string) => {
        console.log('the error =>',error)

      }});

  }

}
