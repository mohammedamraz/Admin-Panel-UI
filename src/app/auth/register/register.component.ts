import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first, from, lastValueFrom } from 'rxjs';

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
    private authenticationService: AuthenticationService,
    private readonly adminService: AdminConsoleService,
    // private adminConsoleService: AdminConsoleService,
    private cdr: ChangeDetectorRef,
    private route: Router

  ) {
    this.data = this.route.getCurrentNavigation()?.extras?.queryParams?.['data'];
   }
   data:any=[]

  ngOnInit(): void {
    console.log(this.data);
    

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

  // verifytrue(){
  //   this.verify=true

  // }


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
    //         this.signUp = true;
    // this.verify=true
    this.error = '';
    sessionStorage.setItem('currentUser', JSON.stringify(data) );
// this.adminService.orgUserAdmin({username: this.formValues['email'].value, password: this.formValues['password'].value })
// have to give a route in place of error  when error is happening it should not route it should give registration succeful


this.adminService.orgAdmin({username: this.signUpForm.value.email, password:this.signUpForm.value.password })
.pipe(first())
.subscribe({
  next: (data: any) => {
    // console.log('there is a ssuucesesdf',data.org_data[0].id)
    if(data.hasOwnProperty('user_data')){
      console.log("user")
      data['orglogin']=false;
      this.adminService.updateUserRegister(data.user_data[0].id).subscribe({
        next:(data:any) =>{
            console.log('there is a status updated',data);
            
        
          },
          error:(error: string) => {
            console.log('error =>',error)
            
          }
        });
        sessionStorage.setItem('currentUser', JSON.stringify(data) );
      
      this.adminService.httpLoading$.next(true);
      this.adminService.fetchUserProdById(data.user_data[0].id).subscribe({
        next:(res:any) =>{
          this.router.navigate([`${data.hasOwnProperty('user_data')? data.user_data[0].org_id+'/userdashboard/'+res[0].product_id : data.org_data[0].id+'/dashboard' }`]);
        }})


    }
    // console.log("cje")
    else if(!data.hasOwnProperty('user_data')){
      data['orglogin']=true;
      this.org_id_for_email=data.org_data[0].id
      from(lastValueFrom(this.adminService.updateRegister(data.org_data[0].id))).subscribe({
        next:(data:any) =>{
            
            from(lastValueFrom(this.adminService.fetchOrgById(this.org_id_for_email))).subscribe({
              next:(data:any)=>{
                const doc = data[0].product.find((ele:any) => ele.product_id == '2')
                if(doc.web_access === true){
                  
                from(lastValueFrom(this.adminService.sendEmailForVitalsWebAccess({url:doc.web_url,email:data[0].organization_email,organisation_admin_name:data[0].admin_name,organisation_name:data[0].organization_name})))
                  .subscribe({next:(data:any)=>{
                    },
                  error:(error:string) =>{
                    console.log('web access error =>',error)
                  }})
                }
              },
              error:(error: string) => {
                console.log('error =>',error)
                
              }
            })
        
          },
          error:(error: string) => {
            console.log('error =>',error)
            
          }
        })
        sessionStorage.setItem('currentUser', JSON.stringify(data));


        this.router.navigate([`${data.hasOwnProperty('user_data')? data.user_data[0].org_id : data.org_data[0].id }/dashboard`]);
    }
    
    // this.adminService.httpLoading$.next(true);


  },
            error: (error: string) => {
              console.log('asdf',error)
              
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

//   onVerify(){
//     console.log('the vilayutu', this.signUpForm.value.ConfirmationCode)
//       this.adminService.ConfirmSignup({username:this.signUpForm.value.email,password:this.signUpForm.value.password,email:this.signUpForm.value.email,ConfirmationCode: this.signUpForm.value.ConfirmationCode })
//       .subscribe({
//         next: (data: any) => {
//           console.log('there is a ssuucesesdf',data);
//           sessionStorage.setItem('currentUser', JSON.stringify(data) );
// // this.adminService.orgUserAdmin({username: this.formValues['email'].value, password: this.formValues['password'].value })
// // have to give a route in place of error  when error is happening it should not route it should give registration succeful


// this.adminService.orgAdmin({username: this.signUpForm.value.email, password:this.signUpForm.value.password })
// .pipe(first())
// .subscribe({
//   next: (data: any) => {
//     // console.log('there is a ssuucesesdf',data.org_data[0].id)
//     if(data.hasOwnProperty('user_data')){
//       console.log("user")
//       data['orglogin']=false;
//       this.adminService.updateUserRegister(data.user_data[0].id).subscribe({
//         next:(data:any) =>{
//             console.log('there is a status updated',data);
            
        
//           },
//           error:(error: string) => {
//             console.log('error =>',error)
            
//           }
//         });
//         sessionStorage.setItem('currentUser', JSON.stringify(data) );
      
//       this.adminService.httpLoading$.next(true);
//       this.adminService.fetchUserProdById(data.user_data[0].id).subscribe({
//         next:(res:any) =>{
//           this.router.navigate([`${data.hasOwnProperty('user_data')? data.user_data[0].org_id+'/userdashboard/'+res[0].product_id : data.org_data[0].id+'/dashboard' }`]);
//         }})


//     }
//     // console.log("cje")
//     else if(!data.hasOwnProperty('user_data')){
//       data['orglogin']=true;
//       this.org_id_for_email=data.org_data[0].id
//       from(lastValueFrom(this.adminService.updateRegister(data.org_data[0].id))).subscribe({
//         next:(data:any) =>{
            
//             from(lastValueFrom(this.adminService.fetchOrgById(this.org_id_for_email))).subscribe({
//               next:(data:any)=>{
//                 const doc = data[0].product.find((ele:any) => ele.product_id == '2')
//                 if(doc.web_access === true){
                  
//                 from(lastValueFrom(this.adminService.sendEmailForVitalsWebAccess({url:doc.web_url,email:data[0].organization_email,organisation_admin_name:data[0].admin_name,organisation_name:data[0].organization_name})))
//                   .subscribe({next:(data:any)=>{
//                     },
//                   error:(error:string) =>{
//                     console.log('web access error =>',error)
//                   }})
//                 }
//               },
//               error:(error: string) => {
//                 console.log('error =>',error)
                
//               }
//             })
        
//           },
//           error:(error: string) => {
//             console.log('error =>',error)
            
//           }
//         })
//         sessionStorage.setItem('currentUser', JSON.stringify(data));


//         this.router.navigate([`${data.hasOwnProperty('user_data')? data.user_data[0].org_id : data.org_data[0].id }/dashboard`]);
//     }
    
//     // this.adminService.httpLoading$.next(true);


//   },
//             error: (error: string) => {
//               console.log('asdf',error)
              
//               this.error = 'Email is already registered. Please check and try again';
//               this.loading = false;


              
//             }});
            
//           },
//           error: (error: string) => {
//             console.log('asdf',error)
//             this.error = 'Wrong OTP. Please check and enter correct OTP';
//          }});


//   }


}
