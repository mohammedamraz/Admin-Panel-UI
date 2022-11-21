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
  tableDataForExcel : any=[];
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
        // console.log("orgid.............",this.prodId);
        this.adminService.fetchDailyScan(this.orgId,this.prodId,this.date,this.pageNumber,this.entries).subscribe((doc:any)=>{
          this.tableData = doc[0].data.data;
          // console.log("reportdata", this.tableData)         
          this.totalPages=doc[0].data.total_pages        
          this.currentPage=doc[0].data.page         
          this.total_user=doc[0].data.total
          console.log("datasets",this.tableData);
          
          //for development
        //   this.tableData =  [
  
        //     {
    
        //         id: 7,
  
        //         product_id: 2,
  
        //         event_mode: false,
  
        //         tests: 1,
  
        //         test_date: "2022-10-31T18:30:00.000Z"
    
        //     },
    
        //     {
    
        //         id: 8,
  
        //         product_id: 2,
  
        //         event_mode: false,
  
        //         tests: 1,
  
        //         test_date: "2022-10-31T18:30:00.000Z"
    
        //     }
    
        // ];
        })
      }
      else{
        this.adminService.fetchUsersDailyScan(this.userId,this.prodId,this.date,this.pageNumber,this.entries).subscribe((doc:any)=>{
          this.tableData = doc[0].data.data;
          this.totalPages=doc[0].data.total_pages
          this.total_user=doc[0].data.total
          console.log("datasets",this.tableData);
          
          //for development
        //   this.tableData =  [
  
        //     {
    
        //         id: 7,
  
        //         product_id: 2,
  
        //         event_mode: false,
  
        //         tests: 1,
  
        //         test_date: "2022-10-31T18:30:00.000Z"
    
        //     },
    
        //     {
    
        //         id: 8,
  
        //         product_id: 2,
  
        //         event_mode: false,
  
        //         tests: 1,
  
        //         test_date: "2022-10-31T18:30:00.000Z"
    
        //     }
    
        // ];
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
    if(this.userId == undefined){
      this.adminService.fetchDailyScan(this.orgId,this.prodId,this.date,1,100000).subscribe((doc:any)=>{
        console.log("my org document",doc);

      
        
        this.tableDataForExcel = doc[0].data.data;


        console.log( "org table data",this.tableDataForExcel);
        
        // this.totalPages=doc[0].data.total_pages
        // this.total_user=doc[0].data.total
        // console.log("datasets",this.tableData);
      });
    
  }
  else
  {
    this.adminService.fetchUsersDailyScan(this.userId,this.prodId,this.date,1,1000000).subscribe((doc:any)=>{
        this.tableDataForExcel = doc[0].data.data;
      //   this.tableData = doc[0].data.data;
      // this.totalPages=doc[0].data.total_pages
      // this.total_user=doc[0].data.total
      // console.log("datasets",this.tableData);
    });
  }
 
    console.log("rsgDversfxdxfcerfx",this.tableDataForExcel);
    
    const filteredDataMap = this.tableDataForExcel.filter((doc:any) => doc.policy_number!==null)

    const stepData = filteredDataMap.map((doc:any) =>{

      console.log("helooooooooo     docccccyyy",doc);
      
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
        heartRate:doc.heart_reate,
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
    console.log('your data excel =>', filteredData)

    // const heading =['id','test_date',	'name',	'age',	'gender',	'city' ,	'username'	,'for_whom',	'heart_rate',	'systolic',	'diastolic',	'stress',	'haemoglobin',	'respiration',	'spo2',	'hrv',	'bmi',	'smoker_accuracy',	'vitals_id',	'policy_number',	'bp_status',	'rbs',	'ecg_url',	'app_name',	'bp'
    // ]
    const Heading = [[
      'Date',	'Logged In User',	'Application No.',	'Scan For',	'Name' ,	'Age'	,'Gender',	'City ',	'Heart Rate','Blood Pressure','',	'Stress',	'Respiration Rate',	'Spo2',	'HRV',	'BMI',	'Smoker', '',
    ]
    ];
    
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, Heading);
    XLSX.utils.sheet_add_aoa(ws, [['systolic']],{origin:'J2'});
    XLSX.utils.sheet_add_aoa(ws, [['diastolic']],{origin:'K2'});
    XLSX.utils.sheet_add_aoa(ws, [['status']],{origin:'R2'});
    XLSX.utils.sheet_add_aoa(ws, [['%']],{origin:'Q2'});
    const merge = [
      { s: { r: 0, c: 9 }, e: { r: 0, c: 10 } }, { s: { r: 0, c: 23 }, e: { r: 0, c: 24 } } 
    ];
    ws["!merges"] = merge;
    XLSX.utils.sheet_add_json(ws, filteredData, { origin: 'A3', skipHeader: true });
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');


    // const worksheet = XLSX.utils.json_to_sheet(filteredData);
    // XLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');


    XLSX.writeFile(wb, this.fileName);
}
loadPage(val:any){
  
  
  this.pageNumber=val
  if(this.userId == undefined){
     
    this.adminService.fetchDailyScan(this.orgId,this.prodId,this.date,this.pageNumber,this.entries).subscribe((doc:any)=>{
      // this.tableData = doc[0].data.data;
      this.tableData =  doc[0].data.data.filter((doc:any)=>doc.policy_number!==null)
      this.totalPages=doc[0].data.total_pages
      this.currentPage=doc[0].data.page
      this.total_user=doc[0].data.total
      // console.log("date",date);
  
    })
  }else{
    this.adminService.fetchUsersDailyScan(this.userId,this.prodId,this.date,this.pageNumber,this.entries).subscribe((doc:any)=>{
      // this.tableData = doc[0].data.data;
      this.tableData =  doc[0].data.data.filter((doc:any)=>doc.policy_number!==null)
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
      // this.tableData = doc[0].data.data;
      this.tableData =  doc[0].data.data.filter((doc:any)=>doc.policy_number!==null)
      this.totalPages=doc[0].data.total_pages
      this.currentPage=doc[0].data.page
      this.total_user=doc[0].data.total
      // console.log("date",date);
  
    })
  }else{
    this.adminService.fetchUsersDailyScan(this.userId,this.prodId,this.date,this.page,this.entries).subscribe((doc:any)=>{
      // this.tableData = doc[0].data.data;
      this.tableData =  doc[0].data.data.filter((doc:any)=>doc.policy_number!==null)
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
    // this.tableData = doc[0].data.data;
    this.tableData =  doc[0].data.data.filter((doc:any)=>doc.policy_number!==null)
    this.totalPages=doc[0].data.total_pages
    this.currentPage=doc[0].data.page
    this.total_user=doc[0].data.total
    console.log("date",date);

  })
}else{
  this.adminService.fetchUsersDailyScan(this.userId,this.prodId,new Date(date).toISOString().substring(0, 10),this.page,this.entries).subscribe((doc:any)=>{
    // this.tableData = doc[0].data.data;
    this.tableData =  doc[0].data.data.filter((doc:any)=>doc.policy_number!==null)
    this.totalPages=doc[0].data.total_pages
    this.currentPage=doc[0].data.page
    this.total_user=doc[0].data.total
    console.log("date",date);

  })
}

}

}

