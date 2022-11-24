
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminConsoleService } from '../services/admin-console.service';
import * as XLSX from 'xlsx-js-style'; 
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-guest-list',
  templateUrl: './guest-list.component.html',
  styleUrls: ['./guest-list.component.scss']
})
export class GuestListComponent implements OnInit {
  fileName='ExcelSheet.xlsx';
  orgId='';
  prodId='';
  page = 1;
  pageNumber:any=1;
  template:boolean=true;
  userList:any=[];
  tableData:any=[]
     
  
  


  pageSizeOptions: number[] = [10, 20,30,40,50,60,70,80,90,100];
  entries:any=this.pageSizeOptions[0]
  activeStatusOptions:any= ['All Org', 'Active Org','Inactive Org'];
  total_pages:any;
  currentPage:any;
  total_user:any;
  userId:any = '';
  activeWizard2: number = 1;
  enableAdditionalScan!: FormGroup;
  user_name : any = 'abdul manaf'
  user_email : any = 'abdul@mail.com'
  totaltest:any=0;
  graphData:any=[]
  attempts : any = 0;
  // email:any=''

  created:boolean=false;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly adminService: AdminConsoleService,
    private modalService: NgbModal,
    private fb: FormBuilder,
  ) { }

  @ViewChild('toggleModal6', { static: true }) input3!: ElementRef;


  ngOnInit(): void {
    
    console.log("hey manaff");
    this.route.params.subscribe((val:any) =>{
      // this.orgId = val.orgId;
      this.prodId = val.prodId;
      // this.route.queryParams.subscribe((val:any) => {
      //   console.log('the value from query params => ', val)
      //   this.userId = val.userId;
      //   console.log('the user Id => ', this.userId)
      // })
  
      this.tableData = []
      this.total_user=0;
        this.currentPage=0
        this.total_pages=0
      this.adminService.fetchGuests(this.prodId,this.pageNumber,this.entries).subscribe((doc:any)=>{
        console.log("rwdsfxc",doc);
        
        this.tableData = doc.data;
        this.total_user=doc.total;
        this.currentPage=doc.page
        this.total_pages=doc.total_pages
          
    
        })


    })
  }
  enableScan(email:any,name:any,attempts:any){
console.log("WRdcrwsdzfxcrsdx",attempts);

    this.user_email =  email;
    this.user_name=name
    this.attempts = attempts
    
    // this.enableAdditionalScan=this.fb.group({


      
    // })


    this.open(<TemplateRef<NgbModal>><unknown>this.input3);
   
    
  

  }



  open(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { centered: true,keyboard : false, backdrop : 'static' });
  }
  
  loadPage(val:any){
    this.pageNumber=val
    console.log("valueeeee", this.pageNumber);
    

    this.adminService.fetchGuests(this.prodId,this.pageNumber,this.entries).subscribe((doc:any)=>{
      this.tableData = doc.data;
      this.total_user=doc.total;
      this.currentPage=doc.page
      this.total_pages=doc.total_pages
    })

  }

  onFilter(data:any){
    this.entries=data.value
    console.log("lavueeeeee", this.entries);
    this.adminService.fetchGuests(this.prodId,this.pageNumber,this.entries).subscribe((doc:any)=>{
      this.tableData = doc.data;
      this.total_user=doc.total;
      this.currentPage=doc.page
      this.total_pages=doc.total_pages  
    })


  }


  ngstyle(){
    const stone = {'background': '#3B4F5F',
     'border': '1px solid #3E596D',
     'color': '#5FB6DB',
     'pointer-events': this.created ? 'none':'auto'
    }
 
   
 
   return stone
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
      console.log('char =>', String.fromCharCode(64+i)+1)
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
    console.log('ws =>', ws)
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

// this.adminService.updateGuestUser(this.guestdata).subscribe((doc:any)=>
// {
//   return doc
// })
  

}

