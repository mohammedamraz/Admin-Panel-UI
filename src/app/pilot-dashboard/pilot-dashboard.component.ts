import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminConsoleService } from '../services/admin-console.service';
import * as XLSX from 'xlsx-js-style'; 
import { AuthenticationService } from '../core/service/auth.service';

@Component({
  selector: 'app-pilot-dashboard',
  templateUrl: './pilot-dashboard.component.html',
  styleUrls: ['./pilot-dashboard.component.scss']
})
export class PilotDashboardComponent implements OnInit {
  products:any
  orgId:any=0;
  selectedValue:String='';
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
  listdetails:any[]=[];
  orgProd:any=[];
  showOrgLiveAlert=false;
  errorOrgMessage = '';
  id:any='';
  listorg:number =3;
  OrgForm!: FormGroup;
  next:boolean=false;
  basicWizardForm!: FormGroup;
  productsWhole: any;
  loggedInUser : any = {};
  orgLogin : boolean = false;
  product_name='';
  period_type : any = [];
  period_data : any  = []
  kiosk_users: any = []
  tabDAta:any[]=[];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly adminService: AdminConsoleService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,


  ) { }

  ngOnInit(): void {
    this.adminService.fetchProducts().subscribe((doc:any)=>{this.products=doc;return doc});
    this.route.params.subscribe((val:any) =>{
      console.log("params",val)
      this.graphArray = [];
      this.orgId = val.orgId;
      this.productId = val.Id;
      this.adminService.fetchOrgById(this.orgId).subscribe({
        next:(res:any) =>{
          this.tabDAta=res;          
          this.id= res[0].id;
          this.organization_name=res[0].organization_name
          this.created_date= new Date(res[0].created_date);
          const selected =res[0].product.findIndex((obj:any)=>obj.product_id===this.productId);
          this.product= res[0].product[selected];
          this.productsWhole= res[0].product;
          this.createGraphArrayItems([this.product],this.dateSelected);
          this.userProduct = [{product_id:this.product.product_id,product_name:this.product.product_id === '1' ? 'HSA' : (this.product.product_id === '2' ? 'Vitals':'RUW' )}]
          this.show = false;
          if(this.product.status == "Expired"){
            this.show = true;
          }
        }});
      this.adminService.fetchLatestUserOfOrgProd(this.orgId,this.productId).subscribe(
        (doc:any) => {
        this.tableData=doc.data;
        this.users=doc.total});
        this.userForm =this.fb.group({
          user_name: ['',Validators.required],
          designation: ['',Validators.required],
          email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
          mobile: ['',[Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
          org_id: [this.orgId],
          product_id: [''],
          role : [''],
          third_party_org_name: ['',Validators.required],
  
        });
        // this.adminService.fetchAllUserOfOrg(this.orgId).subscribe((doc:any)=>{
        //   console.log('all user',doc);
        //   this.users=doc.total
          
        // })
        this.adminService.fetchScan(this.orgId,this.productId).subscribe((doc:any)=>{
          console.log("all scans",doc);
          this.totalScans = doc.total_tests; 

          
        })
    })
    console.log("orglogin",this.orgLogin)
    this.orgId = this.route.snapshot.paramMap.get("orgId");
    this.productId = this.route.snapshot.paramMap.get("Id");
    this.loggedInUser = <any>this.authenticationService.currentUser();
    if(this.loggedInUser.org_data[0].type=='orgAdmin'){
      this.orgLogin = true;
    }

    this.createEditproc(this.products,this.product);


  }

  closeUser(){
    let data={ organisation_admin_name:this.tabDAta[0].admin_name,organisation_admin_email:this.tabDAta[0].organization_email,
      organisation_admin_mobile:this.tabDAta[0].organization_mobile,designation:this.tabDAta[0].designation,organisation_name:this.tabDAta[0].organization_name,expired_date:this.tabDAta[0].product[0].end_date.slice(0,10)}
    this.adminService.sendEmailNotification(data).subscribe({
      next: (res:any) => {
        console.debug(res)
       }   ,
       error : (err:any)=>{
        console.debug(err)
       }
      
    });


  }
  async createGraphArrayItems(product:any,date:any){

    const requests = product.map((doc:any) => this.fetchGraphs(doc.product_id,date));
    Promise.all(requests).then(body => { 
        body.forEach(res => {
        this.graphArray.push(res)
        console.log('graphyyy',this.graphArray);
        
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
    const Heading = [[this.organization_name+' '+this.product_name+' DAILY SCAN REPORT'],[
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
      this.adminService.fetchPerformanceChart(this.orgId,prodId,period).subscribe((doc:any)=>{
      let performaceDetails:any={}

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
    this.userForm.value.role == ''
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

  orgEdit(content: TemplateRef<NgbModal>): void { 
    const filterObj = this.productsWhole.filter((e:any) => e.product_id == this.productId);
    this.createEditproc(this.products,filterObj);
    this.modalService.open(content, { centered: true,keyboard : false, backdrop : 'static' ,size:'lg' });
  }

  createEditproc(products:any,OrgProducts:any){

    this.kiosk_users = [];
    this.adminService.fetchAllUserOfOrgByPage(this.orgId,1,10000,'').subscribe((doc:any)=>{
     doc.data.map((doc: any)=> {
      this.kiosk_users.push(doc.email)
    
    })
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
      pilot_duration: el.pilot_duration-(this.daysLefts(el.end_date))<=0 ? 0 : this.daysLefts(el.end_date)+1,
      product_name: el.product_id === '1' ? 'HSA' : (el.product_id === '2' ? 'Vitals':'RUW' ),
      web_access: el.web_access,
      web_url: el.web_url,
      web_fedoscore:el.web_fedoscore,
      product_junction_id: el.id,
      product_id: el.product_id,
      event_mode:el.event_mode,
      ios_access:el.ios_access,
      mobile_access :el.mobile_access

    }})
    this.list=2+OrgProducts.length
    this.products = product;
    this.listdetails = list;    

      const requests =  OrgProducts.map((doc:any) =>this.fetchScansResolver(doc))
      Promise.all(requests).then(body => {
        body.forEach(res => {
          this.orgProd.push(res)
        })
      })
  }
  fetchScansResolver(data:any){

    return new Promise((resolve,reject) => {
      this.adminService.fetchScan(this.orgId,data.product_id).subscribe(
        (doc:any) => {
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

  checkingProductOrgForm(){
    
    const prod:any = this.listdetails.map((el:any)=>{
      return {
        fedo_score:el.fedoscore,
        pilot_duration: el.pilot_duration,
        product_junction_id:el.product_junction_id,
        product_id: el.product_id,
        web_access: el.web_access,
        web_url: el.web_access ? el.web_url :'',
        web_fedoscore: el.web_access ? el.web_fedoscore:false,
        event_mode: el.event_mode,
        ios_access: el.ios_access ,
        mobile_access: el.mobile_access,
        enable_kiosk: el.enable_kiosk,
        kiosk_user: el.kiosk_user,
      }
    });
    const selectedIndex = this.listdetails.findIndex(obj=>obj.product_id==='2');
    if(this.listdetails[selectedIndex]?.web_url  == '' && this.listdetails[selectedIndex]?.web_access){
      this.errorOrgMessage='web url must be provided';
      this.showOrgLiveAlert=true;    
    }
    else{
    let data = new FormData();
    data.append('fedo_score',prod.map((value:any) => value.fedo_score).toString());
    data.append('pilot_duration',prod.map((value:any) => value.pilot_duration).toString());
    data.append('product_junction_id',prod.filter(((value:any)=> value.product_junction_id == '' ? false : true)).map((value:any) => value.product_junction_id).toString());
    data.append('product_id',prod.map((value:any) => value.product_id).toString());
    data.append('productaccess_web',prod.map((value:any) => value.web_access).toString());
    data.append('web_url',prod.map((value:any) => value.web_url).toString());
    data.append('web_fedoscore',prod.map((value:any) => value.web_fedoscore).toString());
    data.append('event_mode',prod.map((value:any) => value.event_mode).toString());
    data.append('productaccess_mobile',prod.map((value:any) => value.mobile_access).toString());
    data.append('ios_access',prod.map((value:any) => value.ios_access).toString());
    data.append('enable_kiosk',prod.map((value:any) => value.enable_kiosk).toString());
    data.append('kiosk_user',prod.map((value:any) => value.kiosk_user).toString());
    

    this.adminService.patchOrgDetails(this.id, data).subscribe({
      next: (res) => {
        this.activeWizard2=this.activeWizard2+2;
        this.created = true;
      },
      error: (err) => {
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

  setEventMode(event: any,product:any,value:any){
    const selected = this.listdetails.findIndex(obj=>obj.name===product);
    this.listdetails[selected].event_mode = value ;
  }

  updateProduct(event:any, productId:string){
    if(event.target.checked){
      const data = {
        fedoscore: false,
        pilot_duration: 15,
        product_name:parseInt(productId) === 1 ? 'HSA' : (parseInt(productId) === 2 ? 'Vitals':'RUW' ), 
        web_access: false,
        web_url: '',
        web_fedoscore: false,
        product_junction_id: '',
        checked:true,
        product_id:productId
      }
      this.list++;
      this.listdetails.push(data);
      const perish = this.products.findIndex((prod:any) => prod.id == productId)
      this.products[perish]['checked'] = true
      this.products[perish]['noPenetration'] = false

    }
    else{
      const selected =this.listdetails.findIndex(obj=>obj.product_id===productId);
      this.listdetails.splice(selected,1);
      this.list--;
    }
  }

  eventmode(event:any, product:any){
    if(event.target.checked ==  true){
      const selected =this.listdetails.findIndex(obj=>obj.name===product);
      this.listdetails[selected].event_mode = 1;  
    }
    else if (event.target.checked===false){
      const selected =this.listdetails.findIndex(obj=>obj.name===product);
      this.listdetails[selected].event_mode=0;  
    }
  }
  checkInputValue(value: any, product : any){
    const selected =this.listdetails.findIndex(obj=>obj.product_name===product);
    this.listdetails[selected].kiosk_user = value.value;
    // console.log("eventValue",eventValue.target.value)
    
   
}
event_kiosc(event:any, product:any){
  console.log('orgid',this.orgId);

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
  
}
  

