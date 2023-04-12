import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminConsoleService } from '../services/admin-console.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx-js-style'; 

@Component({
  selector: 'app-vitals-dashboard',
  templateUrl: './vitals-dashboard.component.html',
  styleUrls: ['./vitals-dashboard.component.scss']
})
export class VitalsDashboardComponent implements OnInit {
  fileName='ExcelSheet.xlsx';
  vitalsCount:any=0;
  activePilotsCount:any=0;
  vitalsDetails:any[]=[];
  totalTests:any=0;
  files: File[] = [];
  snapshotParam:any = "initial value";
  guestData:any=[];
  user_name : any = 'abdul manaf'
  user_email : any = 'abdul@mail.com'
  attempts : any = 0;
  template:boolean=true;
  activeWizard2: number = 1;


  constructor(
    private readonly adminService: AdminConsoleService,
    private readonly route: ActivatedRoute,
    private modalService: NgbModal,


    ) { }
    @ViewChild('toggleModal6', { static: true }) input3!: ElementRef;


  ngOnInit(): void {
    this.snapshotParam = this.route.snapshot.paramMap.get("id");
    this.route.params.subscribe((val:any) =>{
      this.guestData=[];
      this.snapshotParam = val.id;

      this.adminService.fetchVitalsCount(this.snapshotParam == '1' ? 'hsa':(this.snapshotParam == '2' ? 'vitals':'ruw') ).subscribe((doc:any) =>{
        if(this.snapshotParam==='1'){
          this.vitalsCount = doc.total_hsa_pilot_count;
        }else if(this.snapshotParam==='2'){
          this.vitalsCount = doc.total_vitals_pilot_count;
        }else {
          this.vitalsCount = doc.total_ruw_pilot_count;
          
        }
      });
      this.adminService.fetchActiveVitalsCount(this.snapshotParam == '1' ? 'hsa':(this.snapshotParam == '2' ? 'vitals':'ruw') ).subscribe((doc:any) =>{
        if(this.snapshotParam==='1'){
          this.activePilotsCount = doc.total_hsa_pilot_count;
        }else if(this.snapshotParam==='2'){
          this.activePilotsCount = doc.total_vitals_pilot_count;
        }else {
          this.activePilotsCount = doc.total_ruw_pilot_count;
          
        }
      });
      this.adminService.fetchTotalTestVitals(this.snapshotParam).subscribe((doc:any) =>{console.log('total test vitals',doc);this.totalTests=doc.total_tests});
      this.adminService.fetchLatestVitals(this.snapshotParam).subscribe((doc:any) =>{ this.vitalsDetails=doc.data});
      this.adminService.fetchGuests(this.snapshotParam,1,5).subscribe((doc:any)=>{   
      this.guestData = doc.data;
          
        })
    });
  }

  daysLefts(date:any){
    const firstDate = new Date();
    const secondDate = new Date(date);
    const total_seconds = Math.abs(secondDate.valueOf() - firstDate.valueOf()) / 1000;  
    const days_difference = Math.floor (total_seconds / (60 * 60 * 24)); 
    return days_difference;
  }
  enableScan(email:any,name:any,attempts:any){
    this.user_email =  email;
    this.user_name=name
    this.attempts = attempts
    this.open(<TemplateRef<NgbModal>><unknown>this.input3);
  }
  open(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { centered: true,keyboard : false, backdrop : 'static' });
  }
  exportexcel(data:any) {

    const stepData = data.map((doc:any) =>{
      delete doc.tests;
      delete doc.event_mode;
      delete doc.product_id;
      delete doc.user_id;
      delete doc.org_id;
      doc['smoker_status'] = doc.smoker_accuracy > 50 ?'Smoker': 'Non Smoker';
      doc['smoker_rate'] = doc.smoker_accuracy;
      delete doc.smoker_accuracy;
      return {
        date:new Date(doc.test_date).toISOString().split("T")[0],
        username:doc.username,
        applicationNumber:doc.policy_number,
        scanFor:doc.for_whom,
        name:doc.name,
        age:doc.age,
        gender:doc.gender,
        city:doc.city,
        heartRate:doc.heart_rate,
        systolic:doc.systolic,
        diastolic:doc.diastolic,
        stress:doc.stress,
        respirationRate:doc.respiration,
        spo2:doc.spo2,
        hrv:doc.hrv,
        bmi:doc.bmi,
        smoker_rate :doc['smoker_rate'],
        smoker_status : doc['smoker_status']
      }

    })

    const filteredData = stepData
    const Heading = [[' VITALS DAILY SCAN REPORT  '],[
      'Date',	'Logged In User',	'Application No.',	'Scan For',	'Name' ,	'Age'	,'Gender',	'City ',	'Heart Rate','Blood Pressure','',	'Stress',	'Respiration Rate',	'Spo2',	'HRV',	'BMI',	'Smoker', '',
    ]
    ];
    
    
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, Heading);
    XLSX.utils.sheet_add_aoa(ws, [['systolic']],{origin:'J3'});
    XLSX.utils.sheet_add_aoa(ws, [['diastolic']],{origin:'K3'});
    XLSX.utils.sheet_add_aoa(ws, [['status']],{origin:'R3'});
    XLSX.utils.sheet_add_aoa(ws, [['%']],{origin:'Q3'});
    const merge = [
      { s: { r: 1, c: 9 }, e: { r: 1, c: 10 } }, { s: { r: 1, c: 23 }, e: { r: 1, c: 24 } } 
    ];
  
    ws["A1"].s = {
  font: {
    name: "Calibri",
    sz: 24,
    bold: true,
  },
  };
    for(let i=1;i<=Heading[1].length;i++){
      ws[String.fromCharCode(64+i)+2].s = {
        font: {
          color: { rgb: "FFFFFF" },
        },
        fill:{
          fgColor:{rgb: "8B0000"},
          patternType:'solid'
        },
        border:{
          top:{
            style:'thin',
            color:{rgb:'000000'}
          },
          bottom:{
            style:'thin',
            color:{rgb:'000000'}
          },
          left:{
            style:'thin',
            color:{rgb:'000000'}
          },
          right:{
            style:'thin',
            color:{rgb:'000000'}
          },
        }
      };
  
      if(ws[String.fromCharCode(64+i)+3]){
        ws[String.fromCharCode(64+i)+3].s= {
          font: {
            color: { rgb: "FFFFFF" },
          },
          fill:{
            fgColor:{rgb: "808080"},
            patternType:'solid'
          },
          border:{
            left:{
              style:'thin',
              color:{rgb:'000000'}
            },
            right:{
              style:'thin',
              color:{rgb:'000000'}
            },
          }
  
        };
      }
      else{
        ws[String.fromCharCode(64+i)+3]= {
          t:'n',
          s:{
            font: {
              color: { rgb: "FFFFFF" },
            },
            fill:{
              fgColor:{rgb: "808080"},
              patternType:'solid'
            },
            border:{
              left:{
                style:'thin',
                color:{rgb:'000000'}
              },
              right:{
                style:'thin',
                color:{rgb:'000000'}
              },
            }
          },
          v:'',
        };
      }
    }
    ws["!merges"] = merge;
    XLSX.utils.sheet_add_json(ws, filteredData, { origin: 'A4', skipHeader: true });
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);
}
guestUpdate(){
  
  
  this.template=false
  this.adminService.updateGuestUser({email: this.user_email,attempts: this.attempts,total_tests:this.attempts}).subscribe((doc:any)=>
  {
    return doc
  })

}
reloadCurrentPage() {
  window. location. reload();
  }


}
