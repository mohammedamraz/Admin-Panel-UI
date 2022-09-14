import { Component, OnInit, TemplateRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AdminConsoleService } from '../services/admin-console.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-organisation-details',
  templateUrl: './organisation-details.component.html',
  styleUrls: ['./organisation-details.component.scss']
})
export class OrganisationDetailsComponent implements OnInit {

  files: File[] = [];
  tabDAta:any[]=[];
  OrgForm!: FormGroup;
  basicWizardForm!: FormGroup;
  activeWizard1: number = 1;
  activeWizard2: number = 1;
  list: number = 3;
  listorg:number =3;
  orglist:number =3;
  listdetails:any[]=[];
  showLiveAlert=false;
  errorMessage='';
  showOrgLiveAlert=false;
  errorOrgMessage = '';
  snapshotParam:any = "initial value";
  subscribedParam:any = "initial value";
  srcImage:any='./assets/images/fedo-logo-white.png';

  //details
  organization_name:any='';
  admin_name:any='';
  application_id:any='';
  attempts:any='';
  created_date:any='';
  designation:any='';
  end_date:any='';
  fedo_score:boolean= true;
  id:any='';
  is_deleted:boolean= false;
  logo:any='';
  organization_email:any='';
  organization_mobile:any='';
  pilot_duration:any='';
  product_id:any='';
  stage:any='';
  start_date:any='';
  status:any='';
  updated_date:any='';
  url:any='';
  daysLeft:any=0;
  orglogin:boolean=false;
  

  thirdParty=false;
  product='vitals';
  tableData:any[]=[];



  constructor(
    private sanitizer: DomSanitizer, 
    private readonly adminService: AdminConsoleService,
    private modalService: NgbModal,
    private readonly route: ActivatedRoute,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {


    let data:any =  JSON.parse(sessionStorage.getItem('currentUser')!);
    if(!data.orglogin){
      this.orglogin=data.orglogin;
      this.list=4;
      this.listdetails=[{name:'vital', index:0}];
    }
    this.snapshotParam = this.route.snapshot.paramMap.get("orgId");
    this.adminService.fetchOrgById(this.snapshotParam).subscribe({
      next:(res:any) =>{
        console.log('the file', res);
        this.organization_name= res[0].organization_name;
        this.admin_name= res[0].admin_name;
        this.application_id= res[0].application_id;
        this.attempts= res[0].attempts;
        this.created_date= res[0].created_date;
        this.designation= res[0].designation;
        this.end_date= res[0].end_date;
        this.fedo_score= res[0].fedo_score;
        this.id= res[0].id;
        this.is_deleted= res[0].is_deleted;
        this.logo= res[0].logo;
        this.organization_email= res[0].organization_email;
        this.organization_mobile= res[0].organization_mobile;
        this.pilot_duration= res[0].pilot_duration;
        this.product_id= res[0].product_id;
        this.stage= res[0].stage;
        this.start_date= res[0].start_date;
        this.status= res[0].status;
        this.updated_date= res[0].updated_date;
        this.url= res[0].url.slice(27,);
        const oneDay = 24 * 60 * 60 * 1000;
        const firstDate = new Date();
        const secondDate = new Date(this.end_date);
        const total_seconds = Math.abs(secondDate.valueOf() - firstDate.valueOf()) / 1000;  
        const days_difference = Math.floor (total_seconds / (60 * 60 * 24)); 
        console.log('the days left', days_difference)
        this.daysLeft = days_difference;
        this.adminService.fetchLatestUserOfOrg(this.snapshotParam).subscribe(
          (doc:any) => {this.tableData=doc;}
        )
        },
      error:(err)=>{
        console.log('the error', err);
      }
    })





    this.adminService.fetchLatestOrg().subscribe
    ((doc:any) =>{ this.tabDAta=doc;return doc})

    this.adminService.fetchLatestUserOfOrg(this.snapshotParam).subscribe(
      (doc:any) => {this.tableData=doc;}
    )

    this.OrgForm = this.fb.group({
      organization_name:[this.organization_name],
      admin_name:[this.admin_name],
      organization_email:[this.organization_email,Validators.email],
      organization_mobile:[this.organization_mobile,[Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      fedo_score:[this.fedo_score],
      hsa:[false],
      ruw:[false],
      vitals:[true],
      designation:[this.designation],
      url:[this.url],
      pilot_duration:[this.pilot_duration],
      product_name:['vitals'],
    });

    this.basicWizardForm = this.fb.group({
      user_name: [''],
      designation: [''],
      email: [''],
      mobile: [''],
      organization_name: [this.organization_name],
      product_name: [''],
      third_party_org_name: [''],
      hsa:[false],
      vitals:[true],
      ruw:[false]

    });

  }

  prepopulateOrgFormforEdit(){
    this.OrgForm.controls['organization_name'].setValue(this.organization_name);
    this.OrgForm.controls['admin_name'].setValue(this.admin_name);
    this.OrgForm.controls['organization_email'].setValue(this.organization_email);
    this.OrgForm.controls['organization_mobile'].setValue(this.organization_mobile);
    this.OrgForm.controls['fedo_score'].setValue(this.fedo_score);
    this.OrgForm.controls['hsa'].setValue(false);
    this.OrgForm.controls['ruw'].setValue(false);
    this.OrgForm.controls['vitals'].setValue(true);
    this.OrgForm.controls['designation'].setValue(this.designation);
    this.OrgForm.controls['url'].setValue(this.url);
    this.OrgForm.controls['pilot_duration'].setValue(this.pilot_duration);
    this.OrgForm.controls['product_id'].setValue(1);
 }

  orgEdit(content: TemplateRef<NgbModal>){
    this.modalService.open(content, { centered: true });

  }

  getSize(f: File) {
    const bytes = f.size;
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  getPreviewUrl(f: File) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(encodeURI(URL.createObjectURL(f)));
  }
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
    this.srcImage = './assets/images/fedo-logo-white.png';

  }
  onSelect(event: any) {

    this.files =[...event.addedFiles];
    console.log('the iage',event.addedFiles)
    this.srcImage = this.getPreviewUrl(event.addedFiles[0])
  }
  open(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { centered: true });
  }
  demoFunction(event:any, product:string){
    if(product==='hsa'){
      this.product = product;
      this.OrgForm.controls['ruw'].setValue(false);
      this.OrgForm.controls['vitals'].setValue(false);
      const selected =this.listdetails.findIndex(obj=>obj.name===product);
      this.listdetails.splice(selected,1);
    }
    if(product==='ruw'){
      this.product = product;
      this.OrgForm.controls['hsa'].setValue(false);
      this.OrgForm.controls['vitals'].setValue(false);
      const selected =this.listdetails.findIndex(obj=>obj.name===product);
      this.listdetails.splice(selected,1);
    }
    if(product==='vitals'){
      this.product = product;
      this.OrgForm.controls['hsa'].setValue(false);
      this.OrgForm.controls['ruw'].setValue(false);
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

  demoPrgFunction(event:any, product:string){
    if(product==='hsa'){
      this.product = product;
      this.OrgForm.controls['ruw'].setValue(false);
      this.OrgForm.controls['vitals'].setValue(false);
      const selected =this.listdetails.findIndex(obj=>obj.name===product);
      this.listdetails.splice(selected,1);
    }
    if(product==='ruw'){
      this.product = product;
      this.OrgForm.controls['hsa'].setValue(false);
      this.OrgForm.controls['vitals'].setValue(false);
      const selected =this.listdetails.findIndex(obj=>obj.name===product);
      this.listdetails.splice(selected,1);
    }
    if(product==='vitals'){
      this.product = product;
      this.OrgForm.controls['hsa'].setValue(false);
      this.OrgForm.controls['ruw'].setValue(false);
      const selected =this.listdetails.findIndex(obj=>obj.name===product);
      this.listdetails.splice(selected,1);
    }
    if(event.target.checked){
      this.listorg=4;
      let details={name:product, index:this.list-1}
      this.listdetails.push(details)
    }
    else{
      this.listorg--;
      const selected =this.listdetails.findIndex(obj=>obj.name===product);
      this.listdetails.splice(selected,1);
    }
  }

  checkingForm(){
    this.basicWizardForm.removeControl('ruw');
    this.basicWizardForm.removeControl('hsa');
    this.basicWizardForm.removeControl('vitals');
    this.basicWizardForm.controls['product_name'].setValue(this.product);
    this.basicWizardForm.controls['organization_name'].setValue(this.organization_name);
    this.adminService.createUser(this.basicWizardForm.value).subscribe({
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

  checkingOrgForm(){
    this.OrgForm.removeControl('ruw');
    this.OrgForm.removeControl('hsa');
    this.OrgForm.removeControl('vitals');
    this.OrgForm.controls['product_name'].setValue(this.product);
    this.adminService.patchOrg(this.id, this.OrgForm.value).subscribe({
      next: (res) => {
        console.log('the success=>',res);
        this.activeWizard2=this.activeWizard2+1;
      },
      error: (err) => {
        console.log('the failure=>',err);
        this.errorOrgMessage=err;
        this.showOrgLiveAlert=true;
      },
      complete: () => { }
    });
  }


  // the functions below are written to change or upload an image and also to delete the image

  uploadImageForOrganization(id:any,file:any){

  this.adminService.updateImageLogoInOrgDb(id,file).subscribe({
    next: (res) => {
      
    },
    error: (err) => {
      
    },
    complete: () => { }
  });
}

deleteImageForOrganization(id:any){

  this.adminService.deleteImageLogoFromOrgDb(id).subscribe({
    next: (res) => {
      
    },
    error: (err) => {
      
    },
    complete: () => { }
  });
}

}
