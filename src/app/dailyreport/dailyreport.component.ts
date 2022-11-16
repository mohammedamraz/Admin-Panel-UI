import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminConsoleService } from '../services/admin-console.service';
import * as XLSX from 'xlsx'; 


@Component({
  selector: 'app-dailyreport',
  templateUrl: './dailyreport.component.html',
  styleUrls: ['./dailyreport.component.scss']
})
export class DailyreportComponent implements OnInit {

  orgId='';
  prodId='';
  page=1
  pageNumber:any = 1;
  date = new Date().toISOString().substring(0, 10);
  tableData:any=[];
  pageSizeOptions: number[] = [10, 20,30,40,50,60,70,80,90,100];
  entries:any=this.pageSizeOptions[0]
  activeStatusOptions:any= ['All Org', 'Active Org','Inactive Org'];
  total_pages:any;
  total_user:any;
  currentPage:any;
  fileName='ExcelSheet.xlsx';
  userId:any = '';
  totalPages:any
  // perpage:any=1000;
 




  constructor(
    private readonly route: ActivatedRoute,
    private readonly adminService: AdminConsoleService,
  ) { }

  ngOnInit(): void {
    console.log("hey manaff");
    this.route.params.subscribe((val:any) =>{
      this.orgId = val.orgId;
      this.prodId = val.prodId;
      this.route.queryParams.subscribe((val:any) => {
        console.log('the value from query params => ', val)
        this.userId = val.userId;
        console.log('the user Id => ', this.userId)
      })
  
      
      if(this.userId == undefined){
        this.adminService.fetchDailyScan(this.orgId,this.prodId,this.date,this.pageNumber,this.entries).subscribe((doc:any)=>{
          this.tableData = doc[0].data.data;
          this.totalPages=doc[0].data.total_pages
          this.currentPage=doc[0].data.page
          this.total_user=doc[0].data.total
          console.log("datasets",this.tableData);
          
          //for development
          this.tableData =  [
  
            {
    
                id: 7,
  
                product_id: 2,
  
                event_mode: false,
  
                tests: 1,
  
                test_date: "2022-10-31T18:30:00.000Z"
    
            },
    
            {
    
                id: 8,
  
                product_id: 2,
  
                event_mode: false,
  
                tests: 1,
  
                test_date: "2022-10-31T18:30:00.000Z"
    
            }
    
        ];
        })
      }
      else{
        this.adminService.fetchUsersDailyScan(this.userId,this.prodId,this.date,this.pageNumber,this.entries).subscribe((doc:any)=>{
          this.tableData = doc[0].data.data;
          this.totalPages=doc[0].data.total_pages
          this.total_user=doc[0].data.total
          console.log("datasets",this.tableData);
          
          //for development
          this.tableData =  [
  
            {
    
                id: 7,
  
                product_id: 2,
  
                event_mode: false,
  
                tests: 1,
  
                test_date: "2022-10-31T18:30:00.000Z"
    
            },
    
            {
    
                id: 8,
  
                product_id: 2,
  
                event_mode: false,
  
                tests: 1,
  
                test_date: "2022-10-31T18:30:00.000Z"
    
            }
    
        ];
        })
  
      }




    })
  }

  daysLefts(date:any){
    const firstDate = new Date();
    const secondDate = new Date(date);
    const total_seconds = Math.abs(secondDate.valueOf() - firstDate.valueOf()) / 1000;  
    const days_difference = Math.floor (total_seconds / (60 * 60 * 24)); 
    return days_difference;
  }
  exportexcel() {
    const stepData = this.tableData.map((doc:any) =>{
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
loadPage(val:any){
  
  
  this.pageNumber=val
  if(this.userId == undefined){
     
    this.adminService.fetchDailyScan(this.orgId,this.prodId,this.date,this.pageNumber,this.entries).subscribe((doc:any)=>{
      this.tableData = doc[0].data.data;
      this.totalPages=doc[0].data.total_pages
      this.currentPage=doc[0].data.page
      this.total_user=doc[0].data.total
      // console.log("date",date);
  
    })
  }else{
    this.adminService.fetchUsersDailyScan(this.userId,this.prodId,this.date,this.page,this.entries).subscribe((doc:any)=>{
      this.tableData = doc[0].data.data;
      this.totalPages=doc[0].data.total_pages
      this.currentPage=doc[0].data.page
      this.total_user=doc[0].data.total
      // console.log("date",date);
  
    })
  }
  
  

}
onFilter(data:any){
  console.log("size datra",data.value);
  this.entries=data.value
  if(this.userId == undefined){
     
    this.adminService.fetchDailyScan(this.orgId,this.prodId,this.date,this.pageNumber,this.entries).subscribe((doc:any)=>{
      this.tableData = doc[0].data.data;
      this.totalPages=doc[0].data.total_pages
      this.currentPage=doc[0].data.page
      this.total_user=doc[0].data.total
      // console.log("date",date);
  
    })
  }else{
    this.adminService.fetchUsersDailyScan(this.userId,this.prodId,this.date,this.page,this.entries).subscribe((doc:any)=>{
      this.tableData = doc[0].data.data;
      this.totalPages=doc[0].data.total_pages
      this.currentPage=doc[0].data.page
      this.total_user=doc[0].data.total
      // console.log("date",date);
  
    })
  }
  

}

checkDate(date:any){

        
  if(this.userId == undefined){
     
  this.adminService.fetchDailyScan(this.orgId,this.prodId,new Date(date).toISOString().substring(0, 10),this.pageNumber,this.entries).subscribe((doc:any)=>{
    this.tableData = doc[0].data.data;
    this.totalPages=doc[0].data.total_pages
    this.currentPage=doc[0].data.page
    this.total_user=doc[0].data.total
    console.log("date",date);

  })
}else{
  this.adminService.fetchUsersDailyScan(this.userId,this.prodId,new Date(date).toISOString().substring(0, 10),this.page,this.entries).subscribe((doc:any)=>{
    this.tableData = doc[0].data.data;
    this.totalPages=doc[0].data.total_pages
    this.currentPage=doc[0].data.page
    this.total_user=doc[0].data.total
    console.log("date",date);

  })
}

}

}

