import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminConsoleService } from '../services/admin-console.service';
import * as XLSX from 'xlsx-js-style'; 


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
  // date = new Date().toISOString().substring(0, 10);
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
  created_date : any = ''
  todayDate=new Date();
  organization_name:any=''
  product_name=''
  reportDate:any
  lastReportDate:any

  constructor(
    private readonly route: ActivatedRoute,
    private readonly adminService: AdminConsoleService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((val:any) =>{
      console.log("new valuessss",val);
      
      this.orgId = val.orgId;
      this.prodId = val.prodId;
      this.route.queryParams.subscribe((val:any) => {
        console.log("new ------------",val);
        this.userId = val.userId;
        this.created_date = val.created_date
        this.organization_name=val.organization_name;
        this.reportDate=val.report_date
        this.lastReportDate=val.report_date

         
      })
  
      
      if(this.userId == undefined){
        this.adminService.fetchOrgScanByDateRange(this.orgId,this.prodId,this.reportDate,this.lastReportDate,this.pageNumber,this.entries).subscribe((doc:any)=>{
                    
          this.tableData = doc[0].data.data;
          this.totalPages=doc[0].data.total_pages        
          this.currentPage=doc[0].data.page         
          this.total_user=doc[0].data.total
          
        })
      }
      else{
        this.adminService.fetchUserScanByDateRange(this.userId,this.prodId,this.reportDate,this.lastReportDate,this.pageNumber,this.entries).subscribe((doc:any)=>{
          this.tableData = doc[0].data.data;
          this.totalPages=doc[0].data.total_pages
          this.total_user=doc[0].data.total
      this.currentPage=doc[0].data.page
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
      this.adminService.fetchOrgScanByDateRange(this.orgId,this.prodId,this.reportDate,this.lastReportDate,1,1000000).subscribe((doc:any)=>{
        this.tableDataForExcel = doc[0].data.data;
        this.newExport()
      });
    
  }
  else
  {
    this.adminService.fetchUserScanByDateRange(this.userId,this.prodId,this.reportDate,this.lastReportDate,1,1000000).subscribe((doc:any)=>{
        this.tableDataForExcel = doc[0].data.data;
      this.newExport()
    });
  }
}
  newExport(){  
    this.product_name= this.prodId === '1' ? 'HSA' : (this.prodId === '2' ? 'Vitals':'RUW')

    if(this.prodId=='2'){ 
      

    const filteredDataMap = this.tableDataForExcel.filter((doc:any) => doc.policy_number!==null)
    const stepData = filteredDataMap.map((doc:any) =>{
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
        haemoglobin:doc.haemoglobin,
        rbs:doc.rbs,
        smoker_rate :doc['smoker_rate'],
        smoker_status : doc['smoker_status']
      }

    })

    const filteredData = stepData
    const Heading = [[this.organization_name+' '+this.product_name+'  VITALS DAILY SCAN REPORT'],[
      'Date',	'Logged In User',	'Application No.',	'Scan For',	'Name' ,	'Age'	,'Gender',	'City ',	'Heart Rate','Blood Pressure','',	'Stress',	'Respiration Rate',	'Spo2',	'HRV',	'BMI', 'Haemoglobin', 'RBS',	'Smoker', '',
    ]
    ];
    
    
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, Heading);
    XLSX.utils.sheet_add_aoa(ws, [['systolic']],{origin:'J3'});
    XLSX.utils.sheet_add_aoa(ws, [['diastolic']],{origin:'K3'});
    XLSX.utils.sheet_add_aoa(ws, [['status']],{origin:'S3'});
    XLSX.utils.sheet_add_aoa(ws, [['%']],{origin:'T3'});
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
  }
loadPage(val:any){
  
  
  this.pageNumber=val
  if(this.userId == undefined){
     
    this.adminService.fetchOrgScanByDateRange(this.orgId,this.prodId,this.reportDate,this.lastReportDate,this.pageNumber,this.entries).subscribe((doc:any)=>{
      this.tableData =  doc[0].data.data.filter((doc:any)=>doc.policy_number!==null)
      this.totalPages=doc[0].data.total_pages
      this.currentPage=doc[0].data.page
      this.total_user=doc[0].data.total
  
    })
  }else{
    this.adminService.fetchUserScanByDateRange(this.userId,this.prodId,this.reportDate,this.lastReportDate,this.pageNumber,this.entries).subscribe((doc:any)=>{
      this.tableData =  doc[0].data.data.filter((doc:any)=>doc.policy_number!==null)
      this.totalPages=doc[0].data.total_pages
      this.currentPage=doc[0].data.page
      this.total_user=doc[0].data.total
  
    })
  }
  
  

}
onFilter(data:any){
  this.entries=data.value
  if(this.userId == undefined){
     
    this.adminService.fetchOrgScanByDateRange(this.orgId,this.prodId,this.reportDate,this.lastReportDate,this.pageNumber,this.entries).subscribe((doc:any)=>{
      this.tableData =  doc[0].data.data.filter((doc:any)=>doc.policy_number!==null)
      this.totalPages=doc[0].data.total_pages
      this.currentPage=doc[0].data.page
      this.total_user=doc[0].data.total  
    })
  }else{
    this.adminService.fetchUserScanByDateRange(this.userId,this.prodId,this.reportDate,this.lastReportDate,this.page,this.entries).subscribe((doc:any)=>{
      this.tableData =  doc[0].data.data.filter((doc:any)=>doc.policy_number!==null)
      this.totalPages=doc[0].data.total_pages
      this.currentPage=doc[0].data.page
      this.total_user=doc[0].data.total  
    })
  }
  

}

checkDate(date:any,lastdate : any){
  if(new Date(lastdate) < new Date(date)) this.lastReportDate = this.reportDate;

        
  if(this.userId == undefined){
     
  this.adminService.fetchOrgScanByDateRange(this.orgId,this.prodId,this.reportDate,this.lastReportDate,this.pageNumber,this.entries).subscribe((doc:any)=>{
    this.tableData =  doc[0].data.data.filter((doc:any)=>doc.policy_number!==null)
    this.totalPages=doc[0].data.total_pages
    this.currentPage=doc[0].data.page
    this.total_user=doc[0].data.total
  })
}else{
  this.adminService.fetchUserScanByDateRange(this.userId,this.prodId,this.reportDate,this.lastReportDate,this.pageNumber,this.entries).subscribe((doc:any)=>{
    this.tableData =  doc[0].data.data.filter((doc:any)=>doc.policy_number!==null)
    this.totalPages=doc[0].data.total_pages
    this.currentPage=doc[0].data.page
    this.total_user=doc[0].data.total
  })
}

}

downloadPDF(url : any){
  window.open(url)
}

disableTyping(event: KeyboardEvent) {
  event.preventDefault();
}

}

