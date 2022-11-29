import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminConsoleService } from '../services/admin-console.service';
import * as XLSX from 'xlsx-js-style'; 

@Component({
  selector: 'app-pilot-dashboard',
  templateUrl: './pilot-dashboard.component.html',
  styleUrls: ['./pilot-dashboard.component.scss']
})
export class PilotDashboardComponent implements OnInit {
  products:any
  orgId:any=0;
  productId:any=0;
  product:any={};
  tableData:any[]=[];
  userForm!: FormGroup;
  activeWizard2: number = 1;
  created:boolean=false;
  selectedUserProducts:any[]=[];
  user_name: string="fedo";
  showLiveAlert=false;
  errorMessage='';
  thirdParty=false;
  notThirdParty: boolean =false;
  codeList: any[] = [];
  showButton: boolean = true;
  addTpafunc:boolean=false;
  showLiveAlertNextButton=false;
  errorMessageNextButton='';
  userProduct:any[]=[];
  show:boolean=false;
  list: number = 3;
  @ViewChild('toggleModal4', { static: true }) input!: ElementRef;
  formSubmitted=false
  changeButton:boolean=false
  dateSelected:any=new Date().toISOString().substring(0, 10);
  graphArray:any[]=[];
  todayDate=new Date();
  created_date:any
  organization_name:any=''
  monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
  userList:any[]=[]
  fileName='ExcelSheet.xlsx';
  page:any=1;
  perpage:any=1000
  showLiveAlertAPI=false;
  errorMessageAPI='';
  totalScans : any = 0;
  todayScans : any = 0;
  users : any = 0;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly adminService: AdminConsoleService,
    private modalService: NgbModal,
    private fb: FormBuilder,

  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((val:any) =>{
      this.graphArray = [];
      this.orgId = val.orgId;
      this.productId = val.Id;
      this.adminService.fetchOrgById(this.orgId).subscribe({
        next:(res:any) =>{
          this.organization_name=res[0].organization_name
          this.created_date= new Date(res[0].created_date);
          const selected =res[0].product.findIndex((obj:any)=>obj.product_id===this.productId);
          this.product= res[0].product[selected];
          this.createGraphArrayItems([this.product],this.dateSelected);
          this.userProduct = [{product_id:this.product.product_id,product_name:this.product.product_id === '1' ? 'HSA' : (this.product.product_id === '2' ? 'Vitals':'RUW' )}]
          this.show = false;
          if(this.product.status == "Expired"){
            this.show = true;
          }
        }});
      this.adminService.fetchLatestUserOfOrgProd(this.orgId,this.productId).subscribe(
        (doc:any) => {this.tableData=doc.data;});
        this.userForm =this.fb.group({
          user_name: ['',Validators.required],
          designation: ['',Validators.required],
          email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
          mobile: ['',[Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
          org_id: [this.orgId],
          product_id: [''],
          third_party_org_name: ['',Validators.required],
  
        });
        this.adminService.fetchAllUserOfOrg(this.orgId).subscribe((doc:any)=>{
          console.log('all user',doc);
          this.users=doc.total
          
        })
        this.adminService.fetchScan(this.orgId,this.productId).subscribe((doc:any)=>{
          console.log("all scans",doc);
          this.totalScans = doc.total_tests; 

          
        })
    })
    this.orgId = this.route.snapshot.paramMap.get("orgId");
    this.productId = this.route.snapshot.paramMap.get("Id");

  }
  async createGraphArrayItems(product:any,date:any){

    const requests = product.map((doc:any) => this.fetchGraphs(doc.product_id,date));
    Promise.all(requests).then(body => { 
        body.forEach(res => {
        this.graphArray.push(res)
        })
     });


  }
  fetchgraphdetails(prodId:any,date:any,){
    let graphdetails:any = {}; 
    return new Promise((resolve, reject) => {
      this.adminService.fetchDailyScan(this.orgId,prodId,date,this.page,this.perpage).subscribe((doc:any)=>{
        console.log('asdffweafdszv => ',doc)
        graphdetails['today'] = doc[0].total_org_tests;
       console.log('the date from app =>', date)
       if(new Date().toISOString().substring(0, 10) == date){
         this.todayScans =  doc[0].total_org_tests;
       }
        graphdetails['yesterday'] = doc[0].total_org_tests_onedaybefore;
        graphdetails['previousDay'] = doc[0].total_org_tests_twodaybefore;
        graphdetails['totalScans'] = doc[0].total_org_tests;
        graphdetails['standardModeScans'] = doc[0].total_org_tests_standard ? doc[0].total_org_tests_standard : 0 ;
        graphdetails['eventModeScans'] = doc[0].total_org_tests_event ? doc[0].total_org_tests_event : 0;
        graphdetails['name'] =  prodId === '1' ? 'HSA' : (prodId === '2' ? 'Vitals':'RUW' )
        graphdetails['prodId'] = prodId;
        graphdetails['date'] = date;
        graphdetails['data'] = doc[0].data.data;
        graphdetails['graph'] = {
          type: 'bar',
          data: {
            labels: this.fetchDates(date),
            datasets: [
                {
                    backgroundColor: ["RGBA(104, 116, 129, 0.5)","RGBA(104, 116, 129, 0.5)","RGBA(242, 202, 101, 0.5)"],
                    borderColor: "#ADB5BD",
                    borderWidth: 1,
                    hoverBackgroundColor: "#ADB5BD",
                    hoverBorderColor: "#ADB5BD",
                    data: [graphdetails['previousDay'],  graphdetails['yesterday'] , graphdetails['today']],
                    
                },
            ],
        },
        chartOptions: {
            maintainAspectRatio: false,
        },}

        return resolve(graphdetails)
  
      })
    })

  }
  exportexcel(data:any) {
    const filteredDataMap = data.filter((doc:any) => doc.policy_number!==null)
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
        smoker_rate :doc['smoker_rate'],
        smoker_status : doc['smoker_status']
        
      }
  
    })
  
    const filteredData = stepData
    const Heading = [[this.organization_name+'  VITALS DAILY SCAN REPORT'],[
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

  fetchGraphs(prodId:any,date:any){

    return new Promise((resolve, reject) => {
      const graph = this.fetchgraphdetails(prodId,date);
      const performance = this.fetchPerformanceDetails(prodId,'monthly')
      let details:any ={}
      Promise.all([graph]).then(bodyGraph => { 
        bodyGraph.forEach(res => {
          details = res;
          Promise.all([performance]).then(body => { 
            body.forEach(pergormanceDetails => {
              details['performance'] = pergormanceDetails
            })
         })
        })
        resolve(details)
     })
    })

  }

  fetchTimely(prodId:any,data:any){
    const index = this.graphArray.findIndex(prod => prodId === prod.prodId);
    this.graphArray[index].performance.period = data
    const performance = this.fetchPerformanceDetails(prodId,data)
    Promise.all([performance]).then(body => { 
      body.forEach(pergormanceDetails => {
        this.graphArray[index].performance = pergormanceDetails
      })
   })
  }

  fetchPerformanceDetails(prodId:any,period:any){
    
    return new Promise((resolve, reject) => {
      this.adminService.fetchPerformanceChart(this.orgId,prodId,period).subscribe((doc:any)=>{
      let performaceDetails:any={}

      performaceDetails['currentMonth'] = doc[0].total_org_tests ? doc[0].total_org_tests : 0;
      performaceDetails['previousMonth'] = doc[1].total_org_tests ? doc[1].total_org_tests : 0;
      performaceDetails['varience'] = doc[2].variance ? doc[2].variance : 0;
      performaceDetails['quaterOne'] = doc[0].quarter_one_tests ? doc[0].quarter_one_tests : 0;
      performaceDetails['quaterTwo'] = doc[0].quarter_two_tests ? doc[0].quarter_two_tests : 0;
      performaceDetails['quaterThree'] = doc[0].quarter_three_tests ? doc[0].quarter_three_tests : 0;
      performaceDetails['quaterFour'] = doc[0].quarter_four_tests ? doc[0].quarter_four_tests : 0;
      performaceDetails['PreviousQuaterOne'] = doc[1].quarter_one_tests ? doc[1].quarter_one_tests: 0 ;
      performaceDetails['PreviousQuaterTwo'] = doc[1].quarter_two_tests ? doc[1].quarter_two_tests : 0;
      performaceDetails['PreviousQuaterThree'] = doc[1].quarter_three_tests ? doc[1].quarter_three_tests: 0;
      performaceDetails['PreviousQuaterFour'] = doc[1].quarter_four_tests ? doc[1].quarter_four_tests : 0;
      performaceDetails['name'] =  prodId === '1' ? 'HSA' : (prodId === '2' ? 'Vitals':'RUW' )
      performaceDetails['currentUserEmail'] = doc[0].user_email;
      performaceDetails['currentUserNmae'] = doc[0].user_name==undefined?'NA':doc[0].user_name;
      performaceDetails['PreviouseUserEmail'] = doc[1].user_email;
      performaceDetails['PreviouseUserName'] = doc[1].user_name==undefined?'NA':doc[1].user_name;
      performaceDetails['prodId']=prodId;
      performaceDetails['period']=period;
      performaceDetails['graph']={
        series: [
          {
            name: 'Series A',
            type: 'area',
            data: [performaceDetails['quaterOne'],performaceDetails['quaterTwo'], performaceDetails['quaterThree'], performaceDetails['quaterFour']],
          },
          {
            name: 'Series B',
            type: 'line',
            data: [performaceDetails['PreviousQuaterOne'],performaceDetails['PreviousQuaterTwo'], performaceDetails['PreviousQuaterThree'],performaceDetails['PreviousQuaterFour']],
          },
        ],
        chart: {
          height: 268,
          type: 'line',
          toolbar: {
            show: false,
          },
          stacked: true,
          zoom: {
            enabled: false,
          },
        },
        stroke: {
          curve: 'smooth',
          width: [3, 3],
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },

        fill: {
          type: 'solid',
          opacity: [0, 1],
        },
        colors: ['#188ae2', '#F08FC9'],
        xaxis: {
          categories: ['Q1', 'Q2', 'Q3', 'Q4' ],
          axisBorder: {
            show: true,
            color: '#f7f7f7'
          },
          axisTicks: {
            show: false,
          },
          labels: {
            style: {
              colors: '#adb5bd',
            },
          },
        },
        yaxis: {
          tickAmount: 4,
          labels: {
            style: {
              colors: '#adb5bd',
            },
         },
         axisBorder: {
          show: true,
          color: '#f7f7f7'
         }
        },
        grid: {
          show: true,
          borderColor: '#f7f7f7',
        },
        tooltip: {
          theme: 'dark',
        },
      }
      resolve(performaceDetails)  
    })
    })
  }
  checkdate(event:any,prodId:any,date:any){
    const index = this.graphArray.findIndex(prod => prodId === prod.prodId);
    const promise = [this.fetchgraphdetails(prodId,new Date(date).toISOString().substring(0, 10))];
    Promise.all(promise).then(body => { 
      body.forEach(res => {
        const performance = this.graphArray[index].performance
        this.graphArray[index] = res;
        this.graphArray[index]['performance'] =  performance
      }) 
    })
  }
  fetchDates(date:any){

    const datechecked = new Date(date);
    const yesterday = new Date((new Date(date)).valueOf() - 1000*60*60*24)
    const previousDay = new Date((new Date(date)).valueOf() - 1000*60*60*48)

    return [this.getDate(previousDay),this.getDate(yesterday),this.getDate(datechecked)]
  }
  getDate(date:any){
    return  this.monthNames[new Date(date).getMonth()].slice(0,3) +' ' +new Date(date).getDate()
   }

  daysLefts(date:any){
    const firstDate = new Date();
    const secondDate = new Date(date);
    const total_seconds = Math.abs(secondDate.valueOf() - firstDate.valueOf()) / 1000;  
    const days_difference = Math.floor (total_seconds / (60 * 60 * 24)); 
    return days_difference;
  }

  playstore(data:any,url_type:string){
    if(url_type=="mobile") {let redirectWindow = window.open(data.mobile_url);}
    if(url_type=="web") {let redirectWindow = window.open(data.web_url);}
  }

  open(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { centered: true,keyboard : false, backdrop : 'static' });
  }

  ngstyle(){
    const stone = {'background': '#3B4F5F',
     'border': '1px solid #3E596D',
     'color': '#5FB6DB',
     'pointer-events': this.created ? 'none':'auto'
    }
    return stone
  }
  checkingUserForm(){
    this.userForm.controls['product_id'].setValue(this.selectedUserProducts.map(value => value.product_id).toString());
    this.userForm.value.third_party_org_name == null  ?     this.userForm.removeControl('third_party_org_name'): null;
    this.adminService.createUser(this.userForm.value).subscribe({
      next: (res:any) => {
       
        this.created = true;
        this.user_name=res.user_name
        this.activeWizard2 = this.activeWizard2 + 1;
      },
      error: (err) => {
        this.errorMessageAPI = err;
        this.showLiveAlertAPI = true;

      },
      complete: () => { }
    });
  }

  reloadCurrentPage() {
    window.location.reload();
  }

  change() {
    this.thirdParty = this.notThirdParty;
    this.notThirdParty = !this.notThirdParty;
  }
  inputTpa() {
    this.userForm.get('third_party_org_name')?.value
    if (this.codeList.includes(this.userForm.get('third_party_org_name')?.value)) {
      this.showButton = false;
    }

    else {
      this.showButton = true;
    }
    this.userForm.get("third_party_org_name")?.valueChanges.subscribe(x => {
      this.changeButton=true
      this.addTpafunc=false
   })

  }

  addTpa() {
    this.addTpafunc=true;
    let input = this.userForm.get('third_party_org_name')?.value
    let org_id = this.orgId
    this.adminService.addTpa({ tpa_name: input, org_id: org_id }).subscribe((doc: any) => {   ; return doc;
    })
  }

  updateUserProd(event:any, product:any){
    if(event.target.checked){
      this.selectedUserProducts.push(product);
    }
    else{
      const selected =this.selectedUserProducts.findIndex(obj=>obj.product_id===product.product_id);
      this.selectedUserProducts.splice(selected,1);
    }

  }

  checkUserFirstForm(){
    this.formSubmitted=true;

    if(this.userForm.controls['user_name'].valid && this.userForm.controls['designation'].valid && this.userForm.controls['email'].valid && this.userForm.controls['mobile'].valid&& (this.thirdParty==true || this.notThirdParty== true)){
      if(this.thirdParty==true && (this.userForm.controls['third_party_org_name'].value==null || this.userForm.controls['third_party_org_name'].value.length < 3)){
        this.errorMessageNextButton='Mandatory field';
          this.showLiveAlertNextButton=true;

      }
      else{
      let data ={
        email: this.userForm.value['email'],
        mobile: '+91'+ this.userForm.value['mobile']
    };

      this.adminService.fetchUserDataIfExists(data).subscribe({
        next: (data:any)=>{    
          this.activeWizard2=this.activeWizard2+1;
          this.showLiveAlertNextButton=false;
        },
        error: (err) => {
          this.errorMessageAPI=err;
          this.showLiveAlertAPI=true;
          this.errorMessageNextButton='';
          this.showLiveAlertNextButton=false;
        },
    })
  }
  }

  }
}
  

