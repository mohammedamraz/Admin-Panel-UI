
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminConsoleService } from '../services/admin-console.service';
import * as XLSX from 'xlsx'; 


@Component({
  selector: 'app-guest-list',
  templateUrl: './guest-list.component.html',
  styleUrls: ['./guest-list.component.scss']
})
export class GuestListComponent implements OnInit {

  orgId='';
  prodId='';
  page = 1;
  date = new Date().toISOString().substring(0, 10);
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
  total_org:any;
  currentPage:any;
  fileName='ExcelSheet.xlsx';
  userId:any = '';



  constructor(
    private readonly route: ActivatedRoute,
    private readonly adminService: AdminConsoleService,
  ) { }

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
          
    
        })


    })
  }


  

}

