import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
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
  snapshotParam:any = "initial value";
  guestData:any=[
    {
        "name": "amraz",
        "email": null,
        "phone_number": null,
        "gender": null,
        "attempts": null,
        "fedo_score": null,
        "age": null,
        "id": 2,
        "is_verified": null,
        "product_id": "2",
        "unique_id": "9847814528",
        "total_tests": 2,
        "first_scan": "2022-07-23",
        "last_scan": "2022-11-01",
        "data": [
            {
                "id": 2,
                "org_id": 171,
                "user_id": 100,
                "product_id": 2,
                "event_mode": true,
                "tests": 1,
                "test_date": "2022-07-23T18:30:00.000Z",
                "name": "MOhammeda aamraz",
                "age": null,
                "gender": null,
                "city": null,
                "username": null,
                "for_whom": null,
                "heart_rate": null,
                "systolic": null,
                "diastolic": null,
                "stress": null,
                "haemoglobin": null,
                "respiration": null,
                "spo2": null,
                "hrv": null,
                "bmi": null,
                "smoker_accuracy": null,
                "vitals_id": "9847814528",
                "policy_number": null,
                "bp_status": null,
                "rbs": null,
                "ecg_url": null
            },
            {
                "id": 5,
                "org_id": 276,
                "user_id": 159,
                "product_id": 2,
                "event_mode": false,
                "tests": 1,
                "test_date": "2022-11-01T18:30:00.000Z",
                "name": null,
                "age": null,
                "gender": null,
                "city": null,
                "username": null,
                "for_whom": null,
                "heart_rate": null,
                "systolic": null,
                "diastolic": null,
                "stress": null,
                "haemoglobin": null,
                "respiration": null,
                "spo2": null,
                "hrv": null,
                "bmi": null,
                "smoker_accuracy": null,
                "vitals_id": "9847814528",
                "policy_number": null,
                "bp_status": null,
                "rbs": null,
                "ecg_url": null
            }
        ]
    },
    {
        "name": "amraz",
        "email": "mohd",
        "phone_number": null,
        "gender": null,
        "attempts": "10",
        "fedo_score": null,
        "age": null,
        "id": 1,
        "is_verified": null,
        "product_id": "2",
        "unique_id": "9847814527",
        "total_tests": 3,
        "first_scan": "2022-04-02",
        "last_scan": "2022-11-03",
        "data": [
            {
                "id": 1,
                "org_id": 171,
                "user_id": 100,
                "product_id": 2,
                "event_mode": false,
                "tests": 1,
                "test_date": "2022-04-02T18:30:00.000Z",
                "name": "MOhammeda aamraz",
                "age": null,
                "gender": null,
                "city": null,
                "username": null,
                "for_whom": null,
                "heart_rate": null,
                "systolic": null,
                "diastolic": null,
                "stress": null,
                "haemoglobin": null,
                "respiration": null,
                "spo2": null,
                "hrv": null,
                "bmi": null,
                "smoker_accuracy": null,
                "vitals_id": "9847814527",
                "policy_number": null,
                "bp_status": null,
                "rbs": null,
                "ecg_url": null
            },
            {
                "id": 3,
                "org_id": 171,
                "user_id": 100,
                "product_id": 2,
                "event_mode": false,
                "tests": 1,
                "test_date": "2022-07-28T18:30:00.000Z",
                "name": null,
                "age": null,
                "gender": null,
                "city": null,
                "username": null,
                "for_whom": null,
                "heart_rate": null,
                "systolic": null,
                "diastolic": null,
                "stress": null,
                "haemoglobin": null,
                "respiration": null,
                "spo2": null,
                "hrv": null,
                "bmi": null,
                "smoker_accuracy": null,
                "vitals_id": "9847814527",
                "policy_number": null,
                "bp_status": null,
                "rbs": null,
                "ecg_url": null
            },
            {
                "id": 4,
                "org_id": 171,
                "user_id": 100,
                "product_id": 2,
                "event_mode": null,
                "tests": 1,
                "test_date": "2022-11-03T18:30:00.000Z",
                "name": "MOhammeda aamraz",
                "age": null,
                "gender": null,
                "city": null,
                "username": null,
                "for_whom": null,
                "heart_rate": null,
                "systolic": null,
                "diastolic": null,
                "stress": null,
                "haemoglobin": null,
                "respiration": null,
                "spo2": null,
                "hrv": null,
                "bmi": null,
                "smoker_accuracy": null,
                "vitals_id": "9847814527",
                "policy_number": null,
                "bp_status": null,
                "rbs": null,
                "ecg_url": null
            }
        ]
    }
];







  constructor(
    private readonly adminService: AdminConsoleService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer, 
    private readonly route: ActivatedRoute,

    


    ) { }

  ngOnInit(): void {
    this.snapshotParam = this.route.snapshot.paramMap.get("id");
    console.log('the balance u got =>', this.snapshotParam)
    this.route.params.subscribe((val:any) =>{
      this.snapshotParam = val.id;

      this.adminService.fetchVitalsCount(this.snapshotParam == '1' ? 'hsa':(this.snapshotParam == '2' ? 'vitals':'ruw') ).subscribe((doc:any) =>{
        if(this.snapshotParam==='1'){
          console.log('hsa count true',doc);
          this.vitalsCount = doc.total_hsa_pilot_count;
        }else if(this.snapshotParam==='2'){
          console.log('vitals count true',doc);
          this.vitalsCount = doc.total_vitals_pilot_count;
        }else {
          console.log('ruw count true',doc); 
          this.vitalsCount = doc.total_ruw_pilot_count;
          
        }
        // this.vitalsCount=(this.snapshotParam==='1'?doc.total_hsa_pilot_count:(this.snapshotParam==='2'?doc.total_vitals_pilot_count:doc.total_ruw_pilot_count));
        // doc.total_vitals_pilot_count
      });
      this.adminService.fetchActiveVitalsCount(this.snapshotParam == '1' ? 'hsa':(this.snapshotParam == '2' ? 'vitals':'ruw') ).subscribe((doc:any) =>{
        console.log('active vitals count',doc);
        if(this.snapshotParam==='1'){
          console.log('hsa count true',doc);
          this.activePilotsCount = doc.total_hsa_pilot_count;
        }else if(this.snapshotParam==='2'){
          console.log('vitals count true',doc);
          this.activePilotsCount = doc.total_vitals_pilot_count;
        }else {
          console.log('ruw count true',doc); 
          this.activePilotsCount = doc.total_ruw_pilot_count;
          
        }
        // this.activePilotsCount=doc.total_vitals_pilot_count
      });
      this.adminService.fetchTotalTestVitals(this.snapshotParam).subscribe((doc:any) =>{console.log('total test vitals',doc);this.totalTests=doc.total_tests});
      this.adminService.fetchLatestVitals(this.snapshotParam).subscribe((doc:any) =>{
        // this.adminService.fetchVitalsCount().subscribe((doc:any) =>{console.log('vitals count',doc);this.vitalsCount=doc.total_vitals_pilot_count});
  
        console.log('latest vitals,', doc);this.vitalsDetails=doc.data});
      
      
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
    });
    // this.guestData = []

    this.adminService.fetchGuests(this.snapshotParam,1,5).subscribe((doc:any)=>{   
    this.guestData = doc.data;
      

    })
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

  daysLefts(date:any){
    const firstDate = new Date();
    const secondDate = new Date(date);
    const total_seconds = Math.abs(secondDate.valueOf() - firstDate.valueOf()) / 1000;  
    const days_difference = Math.floor (total_seconds / (60 * 60 * 24)); 
    return days_difference;
  }


}
