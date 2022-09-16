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
};



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

  list: number = 4;
  listdetails:any[]=[];
  next:boolean=false;
  showLiveAlert=false;
  errorMessage='';
  files: File[] = [];
  srcImage:any='./assets/images/fedo-logo-white.png';
  image:any=[];
  org_name: string="fedo";
  persons: PersonDetails[] = [];
  organisationCount:any=0;
  vitalsCount:any=0;
  basicWizardForm!: FormGroup;
  progressWizardForm !: FormGroup;
  btnWizardForm !: FormGroup;
  accountForm!: FormGroup;
  profileForm!: FormGroup;
  validationWizardForm!: FormGroup;
  validationGroup1!: FormGroup
  tabDAta:any[]=[];
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  products:any[]=[];
  selectedProducts:any[]=[];

  constructor(
    private readonly adminService: AdminConsoleService,
    private sanitizer: DomSanitizer, 
    private fb: FormBuilder,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.list=4;
    this.adminService.fetchOrganisationCount().subscribe((doc:any)=>{this.organisationCount=doc['total_organizations_count']})
    this.adminService.fetchVitalsCount().subscribe((doc:any) =>{this.vitalsCount=doc['total_Vitals_pilot_count']})
    this.adminService.fetchLatestOrg().subscribe((doc:any) =>{ this.tabDAta=doc;return doc});
    this.adminService.fetchProducts().subscribe((doc:any)=>{this.products=doc;return doc})
    


    this.validationGroup1 = this.fb.group({
      organization_name: ['', Validators.required],
      admin_name:['',Validators.required],
      designation:['',Validators.required],
      organization_email:['',Validators.required,Validators.email],
      organization_mobile:['',[Validators.required]],
      url:['',[Validators.required]]
    });
    // initialize forms
      this.basicWizardForm = this.fb.group({
        organization_name:['',Validators.required],
        admin_name:['',Validators.required],
        organization_email:['',Validators.required,Validators.email,],
        organization_mobile:['',[Validators.required]],
        fedo_score:[false],
        hsa:[false],
        ruw:[false],
        vitals:[false],
        designation:[''],
        pilot_duration:[''],
        product_name:[''],
        url:['',[Validators.required]]
      });

  }
  get validator() {
    return true;
  }
  //   get officialEmail() {
  //     return this.validationGroup1.get('organization_email');
  // }


  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
    this.srcImage = './assets/images/fedo-logo-white.png';

  }

  onSelect(event: any) {
    console.log('don');
    
    this.files =[...event.addedFiles];
    this.srcImage = event.addedFiles;
    this.image= event.addedFiles[0];
    console.log('the file ', event.addedFiles[0])

  }

  open(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { centered: true });
  }

  checkingForm(){
    var data = new FormData();
    data.append('organization_name',this.basicWizardForm.value.organization_name);
    data.append('designation', this.basicWizardForm.value.designation);
    data.append('admin_name', this.basicWizardForm.value.admin_name);
    data.append('organization_email', this.basicWizardForm.value.organization_email);
    data.append('organization_mobile','+91'+this.basicWizardForm.value.organization_mobile);
    data.append('fedo_score', this.listdetails.map(value=>value.fedo_score).toString());
    data.append('pilot_duration',this.listdetails.map(value=>value.pilot_duration).toString());
    data.append('product_id',this.listdetails.map(value=>value.prod_id).toString());
    data.append('productaccess_web',this.listdetails.map(value=>value.productaccess_web).toString());
    data.append('web_fedoscore',this.listdetails.map(value=>value.web_fedoscore).toString());
    data.append('web_url',this.listdetails.map(value=>value.web_fedoscore).toString());
    data.append('url','https://www.fedo.ai/admin/vital/'+this.basicWizardForm.value.url);
    console.log('this image => ,',this.image)
    this.image==''? null:data.append('file', this.image, this.image.name)
    console.log('the request body => ', data)
    this.adminService.createOrg(data).subscribe({
      next: (res) => {
        console.log('the success=>',res);

        this.activeWizard1=this.activeWizard1+1;
      },
      error: (err) => {
        console.log('the failure=>',err);
        this.errorMessage=err;
        this.showLiveAlert=true;

      },
      complete: () => { }
    });
  }


  demoFunction(event:any, product:any){
    console.log('asdf',event.target.checked);
    console.log('donned',product)
    
    if(event.target.checked){
      this.list++;
      // this.basicWizardForm.controls[product].setValue(true);
      this.selectedProducts.push(product.id)
      let details={
        prod_id:product.id,
        name:product.product_name, 
        index:this.list-1, 
        pilot_duration:0,
        fedo_score:false,
        web_fedoscore:false,
        productaccess_mobile: false,
        web_url:''
      };
      this.listdetails.push(details);
    }
    else{
      this.list--;
      // this.basicWizardForm.controls[product].setValue(false);
      const selected =this.listdetails.findIndex(obj=>obj.name===product.product_name);
      this.selectedProducts.slice(product.id,1);
      this.listdetails.splice(selected,1);
    }
  }

  getPreviewUrl(f: File) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(encodeURI(URL.createObjectURL(f)));
  }

  fetchData(){
    this.showLiveAlert=false;

    if(this.activeWizard1 == 1){
        let data ={
            organization_name: this.basicWizardForm.value.organization_name,
            organization_email: this.basicWizardForm.value.organization_email,
            organization_mobile: '+91'+ this.basicWizardForm.value.organization_mobile

        };
        console.log("hgxfshdgdata",data);
        
    this.adminService.fetchOrgData(data).subscribe({
        next: (data:any)=>{
          
          
          
          this.activeWizard1 = this.activeWizard1+1;
        },
        error:(data:any)=>{
            console.log('the error =>',data);
     
                this.errorMessage=data;
                this.showLiveAlert=true;
            
        }
    })

    }
    else{
        this.activeWizard1 = this.activeWizard1+1;
    }
  }
   get form1() { return this.basicWizardForm.controls; }

}
