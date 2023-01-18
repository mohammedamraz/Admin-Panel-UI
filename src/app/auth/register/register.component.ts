import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first, from, lastValueFrom } from 'rxjs';

// service
import { AuthenticationService } from 'src/app/core/service/auth.service';

// types
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
    ConfirmationCode: ['', [Validators.required]]
  });
  formSubmitted: boolean = false;
  showPassword: boolean = false;
  loading: boolean = false;
  error: string = '';
  signUp:boolean = false;
  verify:boolean = false;
  email:any;
  org_id_for_email:any;

  constructor (
    private fb: FormBuilder,
    private router: Router,
    private readonly adminService: AdminConsoleService,
    private cdr: ChangeDetectorRef,
    private authenticationService: AuthenticationService,
    private route: Router
  ) {
    this.data = this.route.getCurrentNavigation()?.extras?.queryParams?.['data'];
   }
   data:any=[]

  ngOnInit(): void {
    if(this.data[0].email){
    this.signUpForm.controls['email'].setValue(this.data[0].email);
    }
    else this.signUpForm.controls['email'].setValue(this.data[0].organization_email);    
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
    if(this.signUp == false){
      if(this.signUpForm.value.password === this.signUpForm.value.confirmPassword ){
        this.adminService.signup({username:this.signUpForm.value.email,password:this.signUpForm.value.password,email:this.signUpForm.value.email})
        .subscribe({
          next: (data: any) => {
        this.authenticationService.logout();
            this.error = '';
            sessionStorage.setItem('currentUser', JSON.stringify(data) );
            this.adminService.orgAdmin({username: this.signUpForm.value.email, password:this.signUpForm.value.password }).pipe(first())
            .subscribe({
              next: (data: any) => {
                if(data.hasOwnProperty('user_data')){
                  data['orglogin']=false;
                  this.adminService.updateUserRegister(data.user_data[0].id)
                  .subscribe({
                    next:(data:any) =>{},
                    error:(error: string) => {}
                    });
                  sessionStorage.setItem('currentUser', JSON.stringify(data) );
                  from(lastValueFrom(this.adminService.sendEmailOnceUserIsCreated({email:data.user_data[0].email,name:data.user_data[0].user_name.split(' ')[0]})))
                  .subscribe({next:(data:any)=>{},
                  error:(error:string) =>{}
                  })
                  this.adminService.httpLoading$.next(true);
                  this.adminService.fetchUserProdById(data.user_data[0].id).subscribe({
                    next:(res:any) =>{
                      this.router.navigate([`${data.hasOwnProperty('user_data')? data.user_data[0].org_id+'/userdashboard/'+res[0].product_id : data.org_data[0].id+'/dashboard' }`]);
                    }})
                }
                else if(!data.hasOwnProperty('user_data')){
                  data['orglogin']=true;
                  this.org_id_for_email=data.org_data[0].id;
                  from(lastValueFrom(this.adminService.updateRegister(data.org_data[0].id))).subscribe({
                    next:(data:any) =>{
                      from(lastValueFrom(this.adminService.fetchOrgById(this.org_id_for_email))).subscribe({
                        next:(data:any)=>{
                          const doc = data[0].product.find((ele:any) => ele.product_id == '2');
                          from(lastValueFrom(this.adminService.sendEmailOnceOrgIsCreated({email:data[0].organization_email,organisation_admin_name:data[0].admin_name.split(' ')[0],pilot_duration:data[0].product[0].pilot_duration})))
                          .subscribe({
                            next:(data:any)=>{},
                            error:(error:string) =>{}
                          })
                          if(doc.web_access === true){
                            from(lastValueFrom(this.adminService.sendEmailForVitalsWebAccess({url:doc.web_url,email:data[0].organization_email,organisation_admin_name:data[0].admin_name,organisation_name:data[0].organization_name})))
                            .subscribe({
                              next:(data:any)=>{},
                              error:(error:string) =>{}})
                          }
                        },
                        error:(error: string) => {}
                      })
                    },
                    error:(error: string) => {}
                  })
                  sessionStorage.setItem('currentUser', JSON.stringify(data));
                  this.router.navigate([`${data.hasOwnProperty('user_data')? data.user_data[0].org_id : data.org_data[0].id }/dashboard`]);
                }
              },
              error: (error: string) => {         
                this.error = 'Email is already registered. Please check and try again';
                this.loading = false; 
              }});
          },
          error: (error: string) => {
            this.error = 'Email is already registered. Please check and try again';
            this.cdr.detectChanges();
           }});
      }
      else{
        this.error = 'Email is already registered. Please check and try again'
      }
    }
  }
}
