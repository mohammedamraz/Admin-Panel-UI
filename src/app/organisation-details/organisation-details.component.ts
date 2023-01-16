import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AdminConsoleService } from '../services/admin-console.service';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../core/service/auth.service';
import * as XLSX from 'xlsx-js-style'; 
import { COUNTRIES } from '../home/data';


@Component({
  selector: 'app-organisation-details',
  templateUrl: './organisation-details.component.html',
  styleUrls: ['./organisation-details.component.scss']
})
export class OrganisationDetailsComponent implements OnInit {
  files: File[] = [];
  tabDAta:any[]=[];
  OrgForm!: FormGroup;
  userEditForm!: FormGroup;
  basicWizardForm!: FormGroup;
  activeWizard1: number = 1;
  activeWizard2: number = 1;
  list: number = 2;
  listorg:number =3;
  orglist:number =3;
  listdetails:any[]=[];
  showLiveAlert=false;
  errorMessage='';
  showOrgLiveAlert=false;
  errorOrgMessage = '';
  snapshotParam:any = "initial value";
  subscribedParam:any = "initial value";
  srcImage:any='https://fedo-vitals.s3.ap-south-1.amazonaws.com/MicrosoftTeams-image%20%282%29.png';
  dateSelected:any=new Date().toISOString().substring(0, 10);
  monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
  todayDate=new Date();
  organization_name:any='';
  country : any = '';
  city : any = '';
  state : any = '';
  zip : any = '';
  address : any = '';
  admin_name:any='';
  application_id:any='';
  attempts:any='';
  created_date:any='';
  designation:any='';
  end_date:any='';
  fedo_score:boolean= true;
  id:any='';
  is_deleted:boolean= false;
  logo:any='';
  organization_email:any='';
  organization_mobile:any='';
  pilot_duration:any='';
  product:any[]=[];
  stage:any='';
  start_date:any='';
  status:any='';
  updated_date:any='';
  url:any='';
  daysLeft:any=0;
  orglogin:boolean=false;
  user_name: string="fedo";
  userForm!: FormGroup;
  userlogin:boolean=true;
  thirdParty: boolean = false;
  notThirdParty: boolean =false;
  showButton: boolean = true;
  selectedUserProducts:any[]=[];
  userProduct:any[]=[];
  codeList: any[] = [];
  organaization_id:any;
  products:any[]=[];
  next:boolean=false;
  created:boolean = false;
  showLiveAlertNextButton=false;
  date!: { year: number; month: number; };
  graphArray:any[]=[];
  errorMessageResendInvitation = ' '
  showLiveAlertResendInvitation =false
  page:any=1;
  perpage:any=1000
  errorMessageNextButton='';
  addTpafunc:boolean=false;
  orgProd:any=[];
  OrgDetailsEditForm = false;
  @ViewChild('toggleModal4', { static: true }) input!: ElementRef;
  @ViewChild('toggleModal5', { static: true }) input2!: ElementRef;
  @ViewChild('toggleModal6', { static: true }) input3!: ElementRef;
  loggedInUser: any={};
  fileName='ExcelSheet.xlsx';
  tableData:any[]=[];
  formSubmitted=false
  changeButton:boolean=false
  showLiveAlertAPI=false;
  errorMessageAPI='';
  userId: any;
  userProductEdited:any=[];
  countryList=COUNTRIES
  locationValue='';
  stateValue='';
  product_name='';
  period_type : any = [];
  period_data : any  = [];
  kiosk_users : any;
  selectedValue:string=''

  constructor(
    private sanitizer: DomSanitizer, 
    private readonly adminService: AdminConsoleService,
    private modalService: NgbModal,
    private readonly route: ActivatedRoute,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,

  ) { }

  ngOnInit(): void {

    this.loggedInUser = <any>this.authenticationService.currentUser();
    if(this.loggedInUser.org_data[0].is_deleted&&this.loggedInUser.org_data[0].type=='orgAdmin'){
      this.open(<TemplateRef<NgbModal>><unknown>this.input2);
    }

    this.adminService.fetchProducts().subscribe((doc:any)=>{this.products=doc;return doc});
    
    let data:any =  JSON.parse(sessionStorage.getItem('currentUser')!);
    if(data.hasOwnProperty('orglogin')){
      if(data.orglogin){
        this.orglogin=true;
      }
      else{
        this.orglogin=true;
        this.userlogin=false;
      }
    }
    this.snapshotParam = this.route.snapshot.paramMap.get("orgId");
    this.adminService.fetchOrgById(this.snapshotParam).subscribe({
      next:(res:any) =>{
        if(res[0].product.every((v:any)=>v.status==="Expired") && this.orglogin ){
          this.open(<TemplateRef<NgbModal>><unknown>this.input);
        }

        this.tabDAta=res
        this.designation= res[0].designation;
        this.organization_name= res[0].organization_name;
        this.country= res[0].country ? res[0].country : 'NA';
        this.state= res[0].state ? res[0].state : 'NA';
        this.address= res[0].address ? res[0].address : 'NA';
        this.city= res[0].city ? res[0].city : 'NA';
        this.zip= res[0].zip ? res[0].zip : 'NA';
        this.admin_name= res[0].admin_name;
        this.application_id= res[0].application_id;
        this.attempts= res[0].attempts;
        this.created_date= new Date(res[0].created_date);

        this.end_date= res[0].end_date;
        this.fedo_score= res[0].fedo_score;
        this.id= res[0].id;
        this.is_deleted= res[0].is_deleted;
        this.logo= res[0].logo;
        this.organization_email= res[0].organization_email;
        this.organization_mobile= res[0].organization_mobile;
        this.pilot_duration= res[0].pilot_duration;
        this.product= res[0].product;
        this.stage= res[0].stage;
        this.start_date= res[0].start_date;
        this.status= res[0].status;
        this.updated_date= res[0].updated_date;
        this.url= res[0].url;
        const oneDay = 24 * 60 * 60 * 1000;
        const firstDate = new Date();
        const secondDate = new Date(this.end_date);
        const total_seconds = Math.abs(secondDate.valueOf() - firstDate.valueOf()) / 1000;  
        const days_difference = Math.floor (total_seconds / (60 * 60 * 24)); 
        this.daysLeft = days_difference;
        this.srcImage=res[0].logo === ''||!res[0].logo ? "https://fedo-vitals.s3.ap-south-1.amazonaws.com/MicrosoftTeams-image%20%282%29.png": res[0].logo ;
        this.createEditproc(this.products,this.product);
        this.createGraphArrayItems(this.product,this.dateSelected);
        this.adminService.fetchLatestUserOfOrg(this.snapshotParam).subscribe(
          (doc:any) => {this.tableData=doc.data;
            console.log("firstt tabledataaaaaaaa",this.tableData);
            this.tableData.map((doc: any) => {
              var newArray = doc.tests
              var result = newArray.find((item: any) => item.product_id === 2);
              const v = Object.assign(doc, {vitalsTest:result.total_tests})
            })
          }
        )
        },
      error:(err)=>{
        console.log('the error', err);
      }
    })

    this.adminService.fetchLatestUserOfOrg(this.snapshotParam).subscribe(
      (doc:any) => {this.tableData=doc.data;
        console.log("second dataaa",this.tableData);
        this.tableData.map((doc: any) => {
          var newArray = doc.tests
          var result = newArray.find((item: any) => item.product_id === 2);
          const v = Object.assign(doc, {vitalsTest:result.total_tests})
        })        
      }
    )

    this.OrgForm = this.fb.group({
      organization_name:[this.organization_name,[Validators.required]],
      admin_name:[this.admin_name],
      organization_email:[this.organization_email,Validators.email],
      organization_mobile:[this.organization_mobile,[Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      designation:[this.designation,[Validators.required]],
      fedo_score:[this.fedo_score],
      url:[this.url],
      country:[this.country,[Validators.required]],
      state:[this.state,[Validators.required]],
      city:[this.city,[Validators.required]],
      address:[this.address,[Validators.required]],
      zip:[this.zip,[Validators.required,Validators.pattern("[0-9]{6}$")]],
    });

    this.basicWizardForm = this.fb.group({
      user_name: [''],
      designation: [''],
      email: [''],
      mobile: [''],
      organization_name: [this.organization_name],
      product_name: [''],
      third_party_org_name: [''],
      hsa:[false],
      vitals:[true],
      ruw:[false]

    });
    this.userForm =this.fb.group({
      user_name: ['',Validators.required],
        designation: ['',Validators.required],
        email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
        mobile: ['',[Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
        org_id: [''],
        product_id: [''],
        third_party_org_name: ['',Validators.required],

    });
   
  }
  inputZip(){    
    
    const zip = this.OrgForm.get('zip')?.value    
     if(zip.toString().length==6){
       this.adminService.fetchLocation(zip).subscribe((doc:any)=>{
         const res=doc
         if(res.status=='OK'){
         for (let i = 0; i < res.results[0].address_components.length; i++) {
 
           if (res.results[0].address_components[i].types[0] == "locality") {    
             this.locationValue = `${res.results[0].address_components[i].long_name}`;
             this.OrgForm.controls['city']?.setValue(this.locationValue);
             
     
           }
           if(res.results[0].address_components[i].types[0] == "administrative_area_level_1"){
             this.stateValue = res.results[0].address_components[i].long_name
             this.OrgForm.controls['state']?.setValue(this.stateValue);
             
           }
     
     
     
         }
       }
       else {
         this.OrgForm.controls['city']?.reset();
         this.OrgForm.controls['state']?.reset();
       }
 
         
       })
     }
     else {
 
       this.OrgForm.controls['city']?.reset();
       this.OrgForm.controls['state']?.reset();
     }
     
 
   }
  

exportexcel(data:any,prodId:any) {
  if(prodId==2){
  console.log('product id',prodId)
 this.product_name= prodId === '1' ? 'HSA' : (prodId === '2' ? 'Vitals':'RUW')
  

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
  const Heading = [[this.organization_name+' '+this.product_name+'  DAILY SCAN REPORT'],[
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
  XLSX.utils.sheet_add_json(ws, filteredData, { origin: 'A4', skipHeader: true });
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, this.fileName);
}
}

  

  async createGraphArrayItems(products:any,date:any){

    const requests = products.map((doc:any) => this.fetchGraphs(doc.product_id,date));
    Promise.all(requests).then(body => { 
        body.forEach(res => {
        this.graphArray.push(res)
        console.log( "grapghyyyyyyy arraaaaayyy",this.graphArray);
        
        
        })
     });

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

  fetchPerformanceDetails(prodId:any,period:any){
    if(period == 'monthly'){
      this.period_type = ['W1','W2','W3','W4','W5'];
      this.period_data = [0,0,0,0,0];

    }
    else if(period == 'weekly'){
      this.period_type = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
      this.period_data = [0,0,0,0,0,0,0];

    }
    else if(period == 'quarterly'){
      this.period_type = ['M1','M2','M3'];
      this.period_data = [0,0,0];

    }
    else {
      this.period_type = ['1','2','3','4','5','6','7','8','9','10','11','12'];  
      this.period_data = [0,0,0,0,0,0,0,0,0,0,0,0];

    }
    return new Promise((resolve, reject) => {
      this.adminService.fetchPerformanceChart(this.snapshotParam,prodId,period).subscribe((doc:any)=>{
      let performaceDetails:any={}
      console.log('performance items',doc);
      performaceDetails['currentMonth'] = doc[0].total_org_tests ? doc[0].total_org_tests : 0;
      performaceDetails['previousMonth'] = doc[1].total_org_tests ? doc[1].total_org_tests : 0;
      performaceDetails['varience'] = doc[2].variance ? doc[2].variance : 0;
      performaceDetails['quaterOne'] = doc[0].quarterData ? doc[0].quarterData : this.period_data;
      // performaceDetails['quaterTwo'] = doc[0].quarter_two_tests ? doc[0].quarter_two_tests : 0;
      // performaceDetails['quaterThree'] = doc[0].quarter_three_tests ? doc[0].quarter_three_tests : 0;
      // performaceDetails['quaterFour'] = doc[0].quarter_four_tests ? doc[0].quarter_four_tests : 0;
      performaceDetails['PreviousQuaterOne'] = doc[1].quarterData ? doc[1].quarterData: this.period_data ;
      // performaceDetails['PreviousQuaterTwo'] = doc[1].quarter_two_tests ? doc[1].quarter_two_tests : 0;
      // performaceDetails['PreviousQuaterThree'] = doc[1].quarter_three_tests ? doc[1].quarter_three_tests: 0;
      // performaceDetails['PreviousQuaterFour'] = doc[1].quarter_four_tests ? doc[1].quarter_four_tests : 0;
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
            name: 'Current',
            type: 'area',
            data: performaceDetails['quaterOne'],
          },
          {
            name: 'Previous',
            type: 'line',
            data: performaceDetails['PreviousQuaterOne'],
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
          categories: this.period_type,
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


  fetchgraphdetails(prodId:any,date:any,){
    let graphdetails:any = {}; 
    return new Promise((resolve, reject) => {
      this.adminService.fetchDailyScan(this.snapshotParam,prodId,date,this.page,this.perpage).subscribe((doc:any)=>{
        console.log('dataaaaaaaa => ',doc)
        graphdetails['today'] = doc[0].total_org_tests;
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




  fetchDates(date:any){

    const datechecked = new Date(date);
    const yesterday = new Date((new Date(date)).valueOf() - 1000*60*60*24)
    const previousDay = new Date((new Date(date)).valueOf() - 1000*60*60*48)
    return [this.getDate(previousDay),this.getDate(yesterday),this.getDate(datechecked)]
  }


  getDate(date:any){
   return  this.monthNames[new Date(date).getMonth()].slice(0,3) +' ' +new Date(date).getDate()
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

  createEditproc(products:any,OrgProducts:any){
    this.kiosk_users = [];
    this.adminService.fetchAllUserOfOrg(this.snapshotParam).subscribe((doc:any)=>{
     doc.data.map((doc: any)=> {this.kiosk_users.push(doc.email)})
   })
    this.orgProd = [];  
   const product = products.map((doc:any)=>{
      const found = OrgProducts.some((el:any)=>el.product_id === doc.id.toString());
      if(found){
        doc['checked'] = true;
        doc['noPenetration']=true;
      }
      else{
        doc['checked'] = false;
        doc['noPenetration']=false;

      }
      return doc
    })

    const list = OrgProducts.map((el:any) => {return {
      fedoscore: el.fedoscore,
      pilot_duration: el.pilot_duration-(this.daysLefts(el.end_date))<0 ? 0 : this.daysLefts(el.end_date),
      product_name: el.product_id === '1' ? 'HSA' : (el.product_id === '2' ? 'Vitals':'RUW' ),
      web_access: el.web_access,
      // web_url: el.web_url,
      web_fedoscore:el.web_fedoscore,
      product_junction_id: el.id,
      product_id: el.product_id,
      event_mode:el.event_mode,
      ios_access:el.ios_access,
      mobile_access :el.mobile_access,
      // enable_kiosk :el.enable_kiosk? el.enable_kiosk : true,
      // kiosk_user : el.kiosk_user

    }})
    this.list=2+OrgProducts.length
    this.products = product;
    this.listdetails = list;   

    // if(this.orglogin){

      const requests =  OrgProducts.map((doc:any) =>this.fetchScansResolver(doc))
      Promise.all(requests).then(body => {
        body.forEach(res => {
          this.orgProd.push(res)
        })
      })
    // }
  }

  fetchScansResolver(data:any){

    return new Promise((resolve,reject) => {
      this.adminService.fetchScan(this.snapshotParam,data.product_id).subscribe(
        (doc:any) => {
          console.log('dai madaya =>0,',doc)
          const result = {
            product_id:data.product_id,
            productName:data.product_id  === '1' ? 'HSA' : (data.product_id === '2' ? 'Vitals':'RUW' ),
            status:data.status,
            count:doc.total_tests,
            end_date: data.end_date,
            pilot_duration:data.pilot_duration
          }
          return resolve(result)
    })})

  }
  
  
  

  daysLefts(date:any){
    const firstDate = new Date();

    const secondDate = new Date(date);
    const total_seconds = (secondDate.valueOf() - firstDate.valueOf()) / 1000;  
    const days_difference = (total_seconds / (60 * 60 * 24));
    return Math.round(days_difference);
  }

  calculateRemainingDays(date:any,pilotDuration:any){
    return pilotDuration - this.fetchRemainingDays(date)
  }

  fetchRemainingDays(date:any){
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    return Math.round((this.treatAsUTC(new Date())-this.treatAsUTC(new Date(date)))/millisecondsPerDay)
  }
  treatAsUTC(date:any) {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return <any>result;
}
  

  prepopulateOrgFormforEdit(){
    this.OrgForm.controls['organization_name'].setValue(this.organization_name);
    this.OrgForm.controls['admin_name'].setValue(this.admin_name);
    this.OrgForm.controls['organization_email'].setValue(this.organization_email);
    this.OrgForm.controls['organization_mobile'].setValue(this.organization_mobile.slice(3,));
    this.OrgForm.controls['fedo_score'].setValue(this.fedo_score);
    this.OrgForm.controls['designation'].setValue(this.designation);
    this.OrgForm.controls['url'].setValue(this.url);
    this.OrgForm.controls['country'].setValue(this.country);
    this.OrgForm.controls['state'].setValue(this.state);
    this.OrgForm.controls['zip'].setValue(this.zip);
    this.OrgForm.controls['address'].setValue(this.address);
    this.OrgForm.controls['city'].setValue(this.city);
    this.activeWizard2 = 1;

 }

 updateStatus(data:any,userData:any){

  const selected = this.tableData.findIndex(obj => obj.id === userData.id);
  this.tableData[selected].is_deleted = !data;

  this.adminService.patchUserStatus(userData.id, data).subscribe({
    next: async (res) => {
      console.log('the success=>',data);
      if(data) await this.adminService.sendEmailOnceUserIsBackActive({name:userData.user_name,email:userData.email}).subscribe({
        next: (res) =>{
          console.log("dsasyfjewbsd",res)
          this.reloadCurrentPage();
        },
        error : (err)=>{
          console.log("ewdfsxc",err)
          // this.reloadCurrentPage();
        }
      })
      // this.reloadCurrentPage();
    }
  })

}

resendInvitationMail(data:any){
  this.showLiveAlertResendInvitation = true;
  this.errorMessageResendInvitation = 'Invitation Successfully resent!'
  this.adminService.ResendInvitationMailForUser({name:data.user_name,email:data.email,user_id: data.id,url:this.tableData[0].url,organisation_name:this.tableData[0].organization_name}).subscribe({
    next: (res) =>{
      console.log("dsasyfjewbsd",res)
      
    },
    error : (err)=>{
      console.log("ewdfsxc",err)

    }
  })

  }

  orgEdit(content: TemplateRef<NgbModal>): void {
    this.createEditproc(this.products,this.product);
    this.modalService.open(content, { centered: true,keyboard : false, backdrop : 'static' ,size:'lg' });
  }
  orgEditing(content: TemplateRef<NgbModal>,data:any): void {
   const filterObj = this.product.filter((e) => e.product_id == data);
   this.createEditproc(this.products,filterObj);
   this.modalService.open(content, { centered: true,keyboard : false, backdrop : 'static' ,size:'lg' });
  }
  

  getSize(f: File) {
    const bytes = f.size;
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  getPreviewUrl(f: File) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(encodeURI(URL.createObjectURL(f)));
  }
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
    this.adminService.deleteImageLogoFromOrgDb(this.id).subscribe({
      next: (res) => {
        console.log('the success=>',res);
        this.srcImage = 'https://fedo-vitals.s3.ap-south-1.amazonaws.com/MicrosoftTeams-image%20%282%29.png';

      },
      error: (err) => {
        console.log('the failure=>',err);
      },
      complete: () => { }
    });
  }
  onSelect(event: any) {

    this.files =[...event.addedFiles];
    this.srcImage = this.getPreviewUrl(event.addedFiles[0]);

    var data = new FormData();
    data.append('file', event.addedFiles[0], event.addedFiles[0].name)
    this.adminService.updateImageLogoInOrgDb(this.id,data).subscribe({
      next: (res) => {
        console.log('the success=>',res);
      },
      error: (err) => {
        console.log('the failure=>',err);
      },
      complete: () => { }
    });
  }

  reloadCurrentPage() {
    window. location. reload();
    }

  open(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { centered: true,keyboard : false, backdrop : 'static' });
  }

  // demoFunction(event:any, product:string){
  //   if(product==='hsa'){
  //     this.OrgForm.controls['ruw'].setValue(false);
  //     this.OrgForm.controls['vitals'].setValue(false);
  //     const selected =this.listdetails.findIndex(obj=>obj.name===product);
  //     this.listdetails.splice(selected,1);
  //   }
  //   if(product==='ruw'){
  //     this.OrgForm.controls['hsa'].setValue(false);
  //     this.OrgForm.controls['vitals'].setValue(false);
  //     const selected =this.listdetails.findIndex(obj=>obj.name===product);
  //     this.listdetails.splice(selected,1);
  //   }
  //   if(product==='vitals'){
  //     this.OrgForm.controls['hsa'].setValue(false);
  //     this.OrgForm.controls['ruw'].setValue(false);
  //     const selected =this.listdetails.findIndex(obj=>obj.name===product);
  //     this.listdetails.splice(selected,1);
  //   }
  //   if(event.target.checked){
  //     this.list=4;
  //     let details={name:product, index:this.list-1}
  //     this.listdetails.push(details)
  //   }
  //   else{
  //     this.list--;
  //     const selected =this.listdetails.findIndex(obj=>obj.name===product);
  //     this.listdetails.splice(selected,1);
  //   }
  // }


  updateProduct(event:any, productId:string){
    if(event.target.checked){
      const data = {
        fedoscore: false,
        pilot_duration: 0,
        product_name:parseInt(productId) === 1 ? 'HSA' : (parseInt(productId) === 2 ? 'Vitals':'RUW' ), 
        web_access: false,
        // web_url: '',
        web_fedoscore: false,
        product_junction_id: '',
        checked:true,
        product_id:productId,
        event_mode : '0'
      }
      this.list++;
      this.listdetails.push(data);
      const perish = this.products.findIndex(prod => prod.id == productId)
      this.products[perish]['checked'] = true
      this.products[perish]['noPenetration'] = false

    }
    else{
      const selected =this.listdetails.findIndex(obj=>obj.product_id===productId);
      this.listdetails.splice(selected,1);
      this.list--;
    }
  }

  // demoPrgFunction(event:any, product:string){
  //   if(product==='hsa'){
  //     this.OrgForm.controls['ruw'].setValue(false);
  //     this.OrgForm.controls['vitals'].setValue(false);
  //     const selected =this.listdetails.findIndex(obj=>obj.name===product);
  //     this.listdetails.splice(selected,1);
  //   }
  //   if(product==='ruw'){
  //     this.OrgForm.controls['hsa'].setValue(false);
  //     this.OrgForm.controls['vitals'].setValue(false);
  //     const selected =this.listdetails.findIndex(obj=>obj.name===product);
  //     this.listdetails.splice(selected,1);
  //   }
  //   if(product==='vitals'){
  //     this.OrgForm.controls['hsa'].setValue(false);
  //     this.OrgForm.controls['ruw'].setValue(false);
  //     const selected =this.listdetails.findIndex(obj=>obj.name===product);
  //     this.listdetails.splice(selected,1);
  //   }
  //   if(event.target.checked){
  //     this.listorg=4;
  //     let details={name:product, index:this.list-1}
  //     this.listdetails.push(details)
  //   }
  //   else{
  //     this.listorg--;
  //     const selected =this.listdetails.findIndex(obj=>obj.name===product);
  //     this.listdetails.splice(selected,1);
  //   }
  // }

  checkingForm(){
    this.basicWizardForm.removeControl('ruw');
    this.basicWizardForm.removeControl('hsa');
    this.basicWizardForm.removeControl('vitals');
    this.basicWizardForm.controls['organization_name'].setValue(this.organization_name);
    this.adminService.createUser(this.basicWizardForm.value).subscribe({
      next: (res:any) => {
        this.user_name=res[0].user_name

        this.activeWizard1=this.activeWizard1+1;
      },
      error: (err) => {
        console.log('the failure=>',err);
        this.errorMessage=err;
        this.showLiveAlert=true;
      },
      complete: () => { }
    });
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
      console.log(x)
   })

  }
  addTpa() {
    this.addTpafunc=true
    let input = this.userForm.get('third_party_org_name')?.value
    let org_id = this.organaization_id
    this.adminService.addTpa({ tpa_name: input, org_id: org_id }).subscribe((doc: any) => {

       return doc;

    })
  }

  setValue(doc: any){
    this.userForm.reset();
    this.thirdParty = false;
    this.errorMessage = '';
    this.showLiveAlert = false;
    this.userForm.controls['org_id'].setValue(doc.id);
    this.activeWizard1 = 1;
    this.organaization_id=doc.id

    this.userProduct = doc.product.map((val: any) =>({product_name: val.product_id === '1' ? 'HSA' : (val.product_id === '2' ? 'Vitals':'RUW' ), product_id: val.product_id}))
    this.adminService.fetchTpa(this.organaization_id).subscribe((doc: any) => {  
      for (let i = 0; i <= doc.length - 1; i++) {
        if (doc[i].tpa_name != null) {
          this.codeList.push(doc[i].tpa_name)
        }

      }
       ; return doc;
    })
  }

  checkingUserForm(){
    this.userForm.controls['product_id'].setValue(this.selectedUserProducts.map(value => value.product_id).toString());
    this.userForm.value.third_party_org_name == null  ?     this.userForm.removeControl('third_party_org_name'): null;
    this.adminService.createUser(this.userForm.value).subscribe({
      next: (res:any) => {
        this.user_name = res.user_name
        console.log('the success=>', res);
        this.activeWizard1 = this.activeWizard1 + 1;
        this.created = true;
      },
      error: (err) => {
        console.log('the failure=>', err);
        this.errorMessageAPI = err;
        this.showLiveAlertAPI = true;

      },
      complete: () => { }
    });
  }

  setEventMode(event: any,product:any,value:any){
    const selected = this.listdetails.findIndex(obj=>obj.product_name===product);
    this.listdetails[selected].event_mode = value ;
  }

  eventmode(event:any, product:any){
    console.log("asd",event.target.checked)
    if(event.target.checked ==  true){
      const selected =this.listdetails.findIndex(obj=>obj.product_name===product);
      this.listdetails[selected].event_mode = 1;  
    }
    else if (event.target.checked===false){
      const selected =this.listdetails.findIndex(obj=>obj.product_name===product);
      this.listdetails[selected].event_mode=0;  
    }
  }

  event_kiosc(event:any, product:any){  
    if(event.target.checked ==  true){
      const selected =this.listdetails.findIndex(obj=>obj.product_name===product);
      this.listdetails[selected].enable_kiosk = true; 
      this.selectedValue=this.listdetails[selected].kiosk_user ? this.listdetails[selected].kiosk_user : this.kiosk_users[0];
   

    }
    else if (event.target.checked===false){
      const selected =this.listdetails.findIndex(obj=>obj.product_name===product);
      this.listdetails[selected].enable_kiosk= false;  

    }
  }

  checkInputValue(value: any, product : any){
    const selected =this.listdetails.findIndex(obj=>obj.product_name===product);
    this.listdetails[selected].kiosk_user = value.value;
   
}

  checkingOrgForm(){

    this.OrgDetailsEditForm = true
    if(this.OrgForm.controls['organization_mobile'].valid && this.OrgForm.controls['organization_name'].valid &&this.OrgForm.controls['admin_name'].valid && this.OrgForm.controls['designation'].valid && this.OrgForm.controls['country'].valid && this.OrgForm.controls['state'].valid &&this.OrgForm.controls['address'].valid && this.OrgForm.controls['zip'].valid && this.OrgForm.controls['city'].valid ){ 

    this.adminService.patchOrg(this.id, this.OrgForm.value).subscribe({
      next: (res) => {
        console.log('the success=>',res);
        this.activeWizard2=this.activeWizard2+1;
        this.created=true;
      },
      error: (err) => {
        console.log('the failure=>',err);
        this.errorOrgMessage=err;
        this.showOrgLiveAlert=true;
      },
      complete: () => { }
    });
  }
  }

  reloadPage(){
    window.location.reload();
  }

  checkingProductOrgForm(){
    
    const prod:any = this.listdetails.map((el:any)=>{
      return {
        fedo_score:el.fedoscore,
        pilot_duration: el.pilot_duration,
        product_junction_id:el.product_junction_id,
        product_id: el.product_id,
        web_access: el.web_access ? el.web_access:false ,
        // web_url: el.web_access ? el.web_url :'',
        web_fedoscore: el.web_access ? el.web_fedoscore:false,
        event_mode: el.event_mode,
        ios_access: el.ios_access ? el.ios_access:false ,
        mobile_access: el.mobile_access ? el.mobile_access:false,
        enable_kiosk: el.enable_kiosk ? el.enable_kiosk:false,
        kiosk_user: el.kiosk_user ? el.kiosk_user:null,
      }
    });
    console.log('dalsdfj',this.listdetails)
    const selectedIndex = this.listdetails.findIndex(obj=>obj.product_id==='2');
    // if(this.listdetails[selectedIndex]?.web_url  == '' && this.listdetails[selectedIndex]?.web_access){
    //   this.errorOrgMessage='web url must be provided';
    //   this.showOrgLiveAlert=true;    
    // }
    // else{
    let data = new FormData();
    data.append('fedo_score',prod.map((value:any) => value.fedo_score).toString());
    data.append('pilot_duration',prod.map((value:any) => value.pilot_duration).toString());
    data.append('product_junction_id',prod.filter(((value:any)=> value.product_junction_id == '' ? false : true)).map((value:any) => value.product_junction_id).toString());
    data.append('product_id',prod.map((value:any) => value.product_id).toString());
    data.append('productaccess_web',prod.map((value:any) => value.web_access).toString());
    // data.append('web_url',prod.map((value:any) => value.web_url).toString());
    data.append('web_fedoscore',prod.map((value:any) => value.web_fedoscore).toString());
    data.append('event_mode',prod.map((value:any) => value.event_mode).toString());
    data.append('productaccess_mobile',prod.map((value:any) => value.mobile_access).toString());
    data.append('ios_access',prod.map((value:any) => value.ios_access).toString());
    data.append('enable_kiosk',prod.map((value:any) => value.enable_kiosk).toString());
    data.append('kiosk_user',prod.map((value:any) => value.kiosk_user).toString());

    this.adminService.patchOrgDetails(this.id, data).subscribe({
      next: (res) => {
        this.activeWizard2=this.activeWizard2+1;
        this.created = true;
      },
      error: (err) => {
        console.log('the failure=>',err);
        this.errorOrgMessage=err;
        this.showOrgLiveAlert=true;
      },
      complete: () => { }
    });
  // } 
  }

  // the functions below are written to change or upload an image and also to delete the image
  uploadImageForOrganization(id:any,file:any){

  this.adminService.updateImageLogoInOrgDb(id,file).subscribe({
    next: (res) => {
      
    },
    error: (err) => {
      
    },
    complete: () => { }
  });
}

deleteImageForOrganization(id:any){

  this.adminService.deleteImageLogoFromOrgDb(id).subscribe({
    next: (res) => {
      
    },
    error: (err) => {
      
    },
    complete: () => { }
  });
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

updateEditUserProd(event:any, product:any){
  const selected = this.userProduct.findIndex(obj=>obj.product_id===product.product_id)
  if(event.target.checked){
    this.userProduct[selected].checked = true;
    this.userProductEdited.push(this.userProduct[selected]);
  }else{
    this.userProduct[selected].checked = false;
    const index = this.userProductEdited.findIndex((obj:any)=>obj.product_id===product.product_id)
    this.userProductEdited.splice(index,1)
  }
}

clearform(){
    this.srcImage='./assets/images/fedo-logo-white.png';
    this.basicWizardForm.reset();
    this.listdetails=[];
    this.list=4;
    this.activeWizard1 =1;
   }

   checkUserFirstForm(){

    this.formSubmitted=true;

    if(this.userForm.controls['user_name'].valid && this.userForm.controls['designation'].valid && this.userForm.controls['email'].valid && this.userForm.controls['mobile'].valid && (this.thirdParty==true || this.notThirdParty== true)){

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
          this.activeWizard1=this.activeWizard1+1;
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
  ngstyle(){
    const stone = {'background': '#3B4F5F',
     'border': '1px solid #3E596D',
     'color': '#5FB6DB',
     'pointer-events': this.created ? 'none':'auto'
   }
   return stone
  }

  playstore(data:any,url_type:string){
    if(url_type=="mobile") {let redirectWindow = window.open(data.mobile_url);}
    if(url_type=="web") {let redirectWindow = window.open(data.web_url);}
  }

  closeUser(){
    
    let data={ organisation_admin_name:this.tabDAta[0].admin_name,organisation_admin_email:this.tabDAta[0].organization_email,
      organisation_admin_mobile:this.tabDAta[0].organization_mobile,designation:this.tabDAta[0].designation,organisation_name:this.tabDAta[0].organization_name,expired_date:this.tabDAta[0].product[0].end_date.slice(0,10)}
    this.adminService.sendEmailNotification(data).subscribe({
      next: (res:any) => {
       this.authenticationService.logout();
    this.reloadCurrentPage();
       }   ,
       error : (err:any)=>{
       this.authenticationService.logout();
    this.reloadCurrentPage();
       }
      
    });


  }

  closeInactiveUser(){
    
    let data={ organisation_admin_name:this.tabDAta[0].admin_name,organisation_admin_email:this.tabDAta[0].organization_email,
      organisation_admin_mobile:this.tabDAta[0].organization_mobile,designation:this.tabDAta[0].designation,organisation_name:this.tabDAta[0].organization_name}

    this.adminService.sendInactiveOrgEmailNotification(data).subscribe({
      next: (res:any) => {
       this.authenticationService.logout();
       this.reloadCurrentPage();
       }   ,
       error : (err:any)=>{
       this.authenticationService.logout();
       this.reloadCurrentPage();
       }
      
    });


  }

  editUserForm(data:any){
    console.log('the persons data =>',data)
    this.userEditForm = this.fb.group({
      email:[data.email,[Validators.email]],
      mobile:[parseInt(data.mobile.slice(3,)),[Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]  ],
      user_name:[data.user_name,[Validators.required]],
      designation:[data.designation,[Validators.required]],
      third_party_org_name:[data.third_party_org_name, Validators.required]
    })
    this.userId = data.id
    this.open(<TemplateRef<NgbModal>><unknown>this.input3);
    if(this.userEditForm.value.third_party_org_name == null){
      this.notThirdParty = true;
    }
    else{
      this.thirdParty =true;
    }


    this.userProduct = this.product.map((val: any) =>({product_name: val.product_id === '1' ? 'HSA' : (val.product_id === '2' ? 'Vitals':'RUW' ), product_id: val.product_id}))
    this.userProduct = this.userProduct.map((doc:any)=>{
      const found = data.tests.some((el:any)=>el.product_id.toString()==doc.product_id.toString())
      if(found){
        doc['checked'] = true;
        doc['noPenetration']=true;
        
      }
      else{
        doc['checked'] = false;
        doc['noPenetration']=false;
        
      }
      const selected = data.tests.findIndex((el:any)=>el.product_id.toString()==doc.product_id.toString())
      doc['junctionId']= selected === -1 ? '' : data.tests[selected].id;
      doc.checked ? this.userProductEdited.push(doc):null;
      return doc

    })



  }

  editUser(){ 
    if(this.userEditForm.controls['mobile'].valid &&this.userEditForm.controls['user_name'].valid && this.userEditForm.controls['designation'].valid ){
    const data = JSON.parse(JSON.stringify(this.userEditForm.value));;
    data.mobile = ('+91' + this.userEditForm.value.mobile).toString();
    data['product_id']=this.userProductEdited.map((value:any)=> value.product_id).toString();
    data['product_junction_id'] = this.userProductEdited.map((value:any)=> value.junctionId).toString();
    data['product_junction_id'] = this.userProductEdited.filter(((value:any)=> value.junctionId == '' ? false : true)).map((value:any) => value.junctionId).toString();
    data['third_party_org_name'] = this.thirdParty ? data['third_party_org_name']:null; 

    console.log('list => ',this.userProduct)
    console.log('full form => ',data)
    this.adminService.patchuser(this.userId,data).subscribe({
      next: (res:any) => {
        this.activeWizard1=this.activeWizard1+1;

      },
      error: (err) => {
        this.errorMessageAPI=err;
        this.showLiveAlertAPI=true;

      },
      complete: () => { }
    });

  }
}


}
