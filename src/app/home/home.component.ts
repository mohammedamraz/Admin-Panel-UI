import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
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
  files: File[] = [];
  srcImage:any='./assets/images/Logo - Fedo.png';



  persons: PersonDetails[] = [];
  constructor(
    private readonly adminService: AdminConsoleService,
    private sanitizer: DomSanitizer, 
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

  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
    this.srcImage = './assets/images/Logo - Fedo.png';

  }

  onSelect(event: any) {

    this.files =[...event.addedFiles];
    this.srcImage = event.addedFiles
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

  getPreviewUrl(f: File) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(encodeURI(URL.createObjectURL(f)));
  }

}
