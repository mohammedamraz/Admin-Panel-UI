
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminConsoleService } from '../services/admin-console.service';
import * as XLSX from 'xlsx'; 
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
  userList:any=[
    {
      "id": 1,
      "name": "Leanne Graham",
      "username": "Bret",
      'data':[{
        'relation':'sister',
          'jgg':'hgfgf'
      }],
      "email": "Sincere@april.biz" 
      },
      {
        "id": 1,
        "name": "Leanne Graham",
        "username": "Bret",
        'data':[{
          'relation':'sister',
          'jgg':'hgfgf'
      }],
        "email": "Sincere@april.biz" 
        },

  ]
  tableData:any=[
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
  value=1;
  selectedUniqueid:any=0;

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
  
      
      this.adminService.fetchGuests(this.prodId,1,5).subscribe((doc:any)=>{
        this.tableData = doc.data;
        console.log('the table data can be =>', this.tableData)
        this.total_user=doc[0].data.total;
        this.currentPage=doc[0].data.page
        this.total_pages=doc[0].data.total_pages
          
    
        })


    })
  }
  enableScan(uniqueid:any){

    this.selectedUniqueid =  uniqueid;
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
      this.total_user=doc[0].data.total;
      this.currentPage=doc[0].data.page
      this.total_pages=doc[0].data.total_pages
    })

  }

  onFilter(data:any){
    this.entries=data.value
    console.log("lavueeeeee", this.entries);
    this.adminService.fetchGuests(this.prodId,this.pageNumber,this.entries).subscribe((doc:any)=>{
      this.tableData = doc.data;
      this.total_user=doc[0].data.total;
      this.currentPage=doc[0].data.page
      this.total_pages=doc[0].data.total_pages
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

   exportexcel() {
    const stepData = this.userList.map((doc:any) =>{
      delete doc.tests;
      delete doc.event_mode;
      delete doc.product_id;
      delete doc.user_id;
      delete doc.org_id;
      return doc
    })
    
    const worksheet = XLSX.utils.json_to_sheet(stepData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');

    XLSX.writeFile(wb, this.fileName);
    
}

guestUpdate(){
  console.log('slider val',this.value);
  
  this.template=false
  this.adminService.updateGuestUser({unique_id: this.selectedUniqueid,attempts: this.value}).subscribe((doc:any)=>
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

