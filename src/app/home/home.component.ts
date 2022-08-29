import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs';
import { AdminConsoleService } from '../services/admin-console.service';

interface PersonDetails {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  activeWizard1: number = 1;
  activeWizard2: number = 1;
  activeWizard3: number = 1;
  activeWizard4: number = 1;

  list: number = 3;
  listdetails:any[]=[];
  next:boolean=false;
  showLiveAlert=false;
  errorMessage='';

  persons: PersonDetails[] = [];
  constructor(
    private readonly adminService: AdminConsoleService,
    

    private fb: FormBuilder,
    private modalService: NgbModal) { }
  organisationCount:any=0;
  vitalsCount:any=0;
  basicWizardForm!: FormGroup;
  progressWizardForm !: FormGroup;
  btnWizardForm !: FormGroup;
  
  
  accountForm!: FormGroup;

  profileForm!: FormGroup;

  validationWizardForm!: FormGroup;

  tabDAta:any[]=[];

  ngOnInit(): void {
    this.list=3;
    this.adminService.fetchOrganisationCount().subscribe((doc:any)=>{this.organisationCount=doc['total_organizations_count']})
    this.adminService.fetchVitalsCount().subscribe((doc:any) =>{this.vitalsCount=doc['total_Vitals_pilot_count']})
    this.adminService.fetchLatestOrg().subscribe
    ((doc:any) =>{ this.tabDAta=doc;return doc})
    
  this.persons = [
    {
      id: 1,
      firstName: 'Mark',
      lastName: 'Otto',
      userName: '@mdo'
    },
    {
      id: 2,
      firstName: 'Jacob',
      lastName: 'Thornton',
      userName: '@fat'
    },
    {
      id: 3,
      firstName: 'Larry',
      lastName: 'the Bird',
      userName: '@twitter'
    }
  ];

      // initialize forms
      this.basicWizardForm = this.fb.group({
        organization_name:[''],
        admin_name:[''],
        organization_email:['',Validators.email],
        organization_mobile:['',[Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
        fedo_score:[false],
        hsa:[false],
        ruw:[false],
        vitals:[false],
        designation:[''],
        url:[''],
        pilot_duration:[''],
        product_name:[''],
      });

    
  
      // this.btnWizardForm = this.fb.group({
      //   account: this.fb.group({
      //     userName: ['hyper'],
      //     password: ['123456'],
      //     rePassword: ['123456']
      //   }),
      //   profile: this.fb.group({
      //     firstName: ['Francis'],
      //     lastName: ['Brinkman'],
      //     email: ['cory1979@hotmail.com', Validators.email]
      //   }),
      //   acceptTerms: [false, Validators.requiredTrue]
      // });
  
      // this.progressWizardForm = this.fb.group({
      //   account: this.fb.group({
      //     userName: ['hyper'],
      //     password: ['123456'],
      //     rePassword: ['123456']
      //   }),
      //   profile: this.fb.group({
      //     firstName: ['Francis'],
      //     lastName: ['Brinkman'],
      //     email: ['cory1979@hotmail.com', Validators.email]
      //   }),
      //   acceptTerms: [false, Validators.requiredTrue]
      // });
  
      // this.accountForm = this.fb.group({
      //   userName: ['', Validators.required],
      //   password: ['', Validators.required],
      //   rePassword: ['', Validators.required]
      // })
  
      // this.profileForm = this.fb.group({
      //   firstName: ['', Validators.required],
      //   lastName: ['', Validators.required],
      //   email: ['', [Validators.required, Validators.email]]
      // })
  
      // this.validationWizardForm = this.fb.group({
      //   acceptTerms: [false, Validators.requiredTrue]
      // })
  }

  open(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { centered: true });
  }

  checkingForm(){
    console.log('the form values => ',this.basicWizardForm.value)
    var data = new FormData();
    data.append('admin_name', this.basicWizardForm.value.admin_name);
    data.append('designation', this.basicWizardForm.value.designation);
    data.append('organization_email', this.basicWizardForm.value.organization_email);
    data.append('organization_mobile','+91'+this.basicWizardForm.value.organization_mobile);
    data.append('organization_name',this.basicWizardForm.value.organization_name);
    data.append('pilot_duration',this.basicWizardForm.value.pilot_duration);
    data.append('product_name',this.listdetails[0].name);
    data.append('url','https://www.fedo.ai/vitals/'+this.basicWizardForm.value.url);
    data.append('fedo_score', this.basicWizardForm.value.fedo_score.toString());
    this.adminService.createOrg(data).subscribe({
      next: (res) => {
        console.log('the success=>',res);
        this.activeWizard1=this.activeWizard1+1;
        // {this.snackBar.open("Pilot Created Successfully",'X', { duration: 5000, verticalPosition: 'bottom', horizontalPosition: 'center', panelClass: 'green'})}
        // this.formGroupDirective?.resetForm();
      },
      error: (err) => {
        console.log('the failure=>',err);
        this.errorMessage=err;
        this.showLiveAlert=true;
      //    { this.snackBar.open(err.error.message,'', {
      //   duration: 5000, verticalPosition: 'bottom', horizontalPosition: 'center', panelClass: 'red'
      // }); }
      },
      complete: () => { }
    });
  }

  demoFunction(event:any, product:string){
    console.log('asdf',event.target.checked);
    if(product==='hsa'){
      this.basicWizardForm.controls['ruw'].setValue(false);
      this.basicWizardForm.controls['vitals'].setValue(false);
      const selected =this.listdetails.findIndex(obj=>obj.name===product);
      this.listdetails.splice(selected,1);
    }
    if(product==='ruw'){
      this.basicWizardForm.controls['hsa'].setValue(false);
      this.basicWizardForm.controls['vitals'].setValue(false);
      const selected =this.listdetails.findIndex(obj=>obj.name===product);
      this.listdetails.splice(selected,1);
    }
    if(product==='vitals'){
      this.basicWizardForm.controls['hsa'].setValue(false);
      this.basicWizardForm.controls['ruw'].setValue(false);
      const selected =this.listdetails.findIndex(obj=>obj.name===product);
      this.listdetails.splice(selected,1);
    }
    if(event.target.checked){
      this.list=4;
      let details={name:product, index:this.list-1}
      this.listdetails.push(details)
    }
    else{
      this.list--;
      const selected =this.listdetails.findIndex(obj=>obj.name===product);
      this.listdetails.splice(selected,1);
    }
  }

}
