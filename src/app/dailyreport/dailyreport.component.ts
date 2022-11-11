import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminConsoleService } from '../services/admin-console.service';

@Component({
  selector: 'app-dailyreport',
  templateUrl: './dailyreport.component.html',
  styleUrls: ['./dailyreport.component.scss']
})
export class DailyreportComponent implements OnInit {

  orgId='';
  prodId='';
  page = 1;
  date = new Date().toISOString().substring(0, 10);
  tableData:any=[];
  pageSizeOptions: number[] = [10, 20,30,40,50,60,70,80,90,100];
  entries:any=this.pageSizeOptions[0]
  activeStatusOptions:any= ['All Org', 'Active Org','Inactive Org'];
  total_pages:any;
  total_org:any;
  currentPage:any;


  constructor(
    private readonly route: ActivatedRoute,
    private readonly adminService: AdminConsoleService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((val:any) =>{
      val.orgId = this.orgId;
      val.prodId = this.prodId;

      this.adminService.fetchDailyScan(this.orgId,this.prodId,this.date).subscribe((doc:any)=>{
        this.tableData = doc[0].data;
        //for development
        this.tableData =  [

          {
  
              "id": 7,
  
              "product_id": 2,
  
              "event_mode": false,
  
              "tests": 1,
  
              "test_date": "2022-10-31T18:30:00.000Z"
  
          },
  
          {
  
              "id": 8,
  
              "product_id": 2,
  
              "event_mode": false,
  
              "tests": 1,
  
              "test_date": "2022-10-31T18:30:00.000Z"
  
          }
  
      ]
      })



    })
  }

  daysLefts(date:any){
    const firstDate = new Date();
    const secondDate = new Date(date);
    const total_seconds = Math.abs(secondDate.valueOf() - firstDate.valueOf()) / 1000;  
    const days_difference = Math.floor (total_seconds / (60 * 60 * 24)); 
    return days_difference;
  }

}
