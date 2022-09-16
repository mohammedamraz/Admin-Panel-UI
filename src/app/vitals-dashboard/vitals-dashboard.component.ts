import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { map } from 'rxjs';
import { AdminConsoleService } from '../services/admin-console.service';


interface PersonDetails {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
}

@Component({
  selector: 'app-vitals-dashboard',
  templateUrl: './vitals-dashboard.component.html',
  styleUrls: ['./vitals-dashboard.component.scss']
})
export class VitalsDashboardComponent implements OnInit {
  persons: PersonDetails[] = [];
  vitalsCount:any=0;
  activePilotsCount:any=0;
  vitalsDetails:any[]=[];
  totalTests:any=0;
  basicWizardForm!: FormGroup;
  list: number = 3;
  activeWizard1: number = 1;
  listdetails:any[]=[];
  srcImage:any='./assets/images/Logo - Fedo.png';
  files: File[] = [];
  showLiveAlert=false;
  errorMessage='';






  constructor(
    private readonly adminService: AdminConsoleService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer, 


    ) { }

  ngOnInit(): void {

    this.adminService.fetchVitalsCount().subscribe((doc:any) =>{console.log('don',doc);this.vitalsCount=doc.total_vitals_pilot_count});
    this.adminService.fetchActiveVitalsCount().subscribe((doc:any) =>{console.log('don',doc);this.activePilotsCount=doc.total_vitals_pilot_count});
    this.adminService.fetchTotalTestVitals().subscribe((doc:any) =>{console.log('don',doc);this.totalTests=doc.total_tests});
    this.adminService.fetchLatestVitals().subscribe((doc:any) =>{console.log('dude,', doc);this.vitalsDetails=doc});
    
    
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

  onSelect(event: any) {

    this.files =[...event.addedFiles];
    this.srcImage = event.addedFiles
  }
  
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
    this.srcImage = './assets/images/Logo - Fedo.png';
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


}
