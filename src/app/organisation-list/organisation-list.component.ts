import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { COUNTRIES } from '../home/data';
import { Employee } from '../pages/tables/advanced/advance.model';
import { EMPLOYEES } from '../pages/tables/advanced/data';
import { AdminConsoleService } from '../services/admin-console.service';
import { AdvancedTableService } from '../shared/advanced-table/advanced-table.service';
import { SortEvent } from '../shared/advanced-table/sortable.directive';

@Component({
  selector: 'app-organisation-list',
  templateUrl: './organisation-list.component.html',
  styleUrls: ['./organisation-list.component.scss']
})
export class OrganisationListComponent implements OnInit {
  page = 1;
  activeWizard2: number = 1;
  showLiveAlert=false;
  list: number = 4;
  basicWizardForm!: FormGroup;
  errorMessage='';
  listdetails:any[]=[];
  tabDAta:any[]=[];
  tableData: any[] =EMPLOYEES;
  @Output() search = new EventEmitter<string>();
  records: Employee[] = [];
  columns: any[] = [];
  product='';
  srcImage:any='./assets/images/fedo-logo-white.png';
  files: File[] = [];
  products:any[]=[];
  next:boolean=false;
  org_name: any
  user_name: string="";
  image:any=[];
  selectedProducts:any[]=[];
  showButton: boolean = true;
  organaization_id:any;
  created:boolean=false;
  length:any
  pageSizeOptions: number[] = [10, 20,30,40,50,60,70,80,90,100];
  activeStatusOptions:any= ['All Org', 'Active Org','Inactive Org']
  activeStatusValue: any= this.activeStatusOptions[1]
  errorMessageResendInvitation = ' '
  showLiveAlertResendInvitation =false 
  entries:any=this.pageSizeOptions[0]
  pagenumber:any=1;
  total_pages:any;
  total_org:any;
  urlFormSubmitted = false
  firstFormSubmitted = false
  secondFormSubmitted = false
  currentPage:any;
  showLiveAlertAPI=false;
  errorMessageAPI='';
  validation:boolean=false;
  web_url_error='';
  web_url_error_token= false;
  stateValue='';
  locationValue='';
  countryList=COUNTRIES
  org_search = '';
  industryList : any = [];
  selectedIndustry = ''





  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private readonly adminService: AdminConsoleService,
    private router: Router,
    public service: AdvancedTableService,
    private sanitizer: DomSanitizer, 
    private _route: ActivatedRoute,


  ) { }

  ngOnInit(): void {
    this._route.queryParams.subscribe((params:any) => {
      console.log('params => ',params)
      JSON.stringify(params) === '{}' ? null : [this.pagenumber= params.page, this.entries = params.entry , this.activeStatusValue = params.status]
      this.adminService.fetchAllOrgByPage(this.pagenumber,this.entries,ACTIVE[this.activeStatusValue]).subscribe
      ((doc:any) =>{ 
        this.page = this.pagenumber
        this.total_org=doc.total
        this.currentPage=doc.page
        this.total_pages=doc.total_pages
  
        this.tabDAta=doc.data;
        this.length=this.tabDAta.length
      
        return doc
      });
    })
    this.columns = this.tabDAta;

    this.adminService.fetchProducts().subscribe((doc:any)=>{this.products= doc.filter((doc: { id: number; }) => doc.id !=  1);return doc})
    this.adminService.fetchIndustry().subscribe((doc:any)=>{this.industryList= doc;return doc} ) 


    this.basicWizardForm = this.fb.group({
      organization_name:[''],
      admin_name:['',Validators.required],
      organization_email:['',[Validators.required,Validators.pattern("^\\s{0,}?[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,7}\\s{0,}?$")]],
      organization_mobile:['',[Validators.required,  Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      is_web : [false],
      fedo_score:[false],
      hsa:[false],
      ruw:[false],
      vitals:[false],
      designation:[''],
      url:['',Validators.required],
      pilot_duration:[''],
      product_name:[''],
      country:['',[Validators.required]],
      industry:['',[Validators.required]],
      zip:['',[Validators.required,Validators.pattern("^[0-9]{6}$")]],
      state:['',[Validators.required]],
      city:['',[Validators.required]],
      address:['',[Validators.required]],
      
    });

  }

  inputZip(){    
    const zip = this.basicWizardForm.get('zip')?.value
     if(zip.toString().length==6){
       this.adminService.fetchLocation(zip).subscribe((doc:any)=>{
         const res=doc
         if(res.status=='OK'){
         for (let i = 0; i < res.results[0].address_components.length; i++) {
 
           if (res.results[0].address_components[i].types[0] == "locality") {    
             this.locationValue = `${res.results[0].address_components[i].long_name}`;
             this.basicWizardForm.controls['city']?.setValue(this.locationValue);
             
     
           }
           if(res.results[0].address_components[i].types[0] == "administrative_area_level_1"){
             this.stateValue = res.results[0].address_components[i].long_name
             this.basicWizardForm.controls['state']?.setValue(this.stateValue);
             
           }
     
     
     
         }
       }
       else {
         this.basicWizardForm.controls['city']?.reset();
         this.basicWizardForm.controls['state']?.reset();
       }
 
         
       })
     }
     else {
 
       this.basicWizardForm.controls['city']?.reset();
       this.basicWizardForm.controls['state']?.reset();
     }
     
 
   }
 

  loadPage(val:any){
    this.pagenumber=val;
    this.router.navigate([], {
      queryParams: {
        page: this.pagenumber,
        status : this.activeStatusValue,
        entry : this.entries
      },
    }); 
    this.adminService.fetchAllOrgByPage(this.pagenumber,this.entries,ACTIVE[this.activeStatusValue]).subscribe
    ((doc:any) =>{ 
      this.page = this.pagenumber
      this.total_org=doc.total
      this.total_pages=doc.total_pages
      this.currentPage=doc.page
      this.tabDAta=doc.data
      this.length=this.tabDAta.length
     
      return doc});
      this.columns = this.tabDAta;
  }

  onFilter (data:any) {
      this.entries=data.value
      this.router.navigate([], {
        queryParams: {
          page: this.pagenumber,
          status : this.activeStatusValue,
          entry : this.entries
        },
        
      }
      );

      this.adminService.fetchAllOrgByPage(this.pagenumber,this.entries,ACTIVE[this.activeStatusValue]).subscribe
    ((doc:any) =>{ 
      this.total_pages=doc.total_pages
      this.currentPage=doc.page
      this.total_org=doc.total
      this.tabDAta=doc.data;
      this.length=this.tabDAta.length
      this.tabDAta = doc.sort((a: { id: number; },b: { id: number; })=> b.id-a.id);
      
      return doc});
  }


  clearform(){
    this.srcImage='./assets/images/fedo-logo-white.png';
    this.basicWizardForm.reset();
    this.listdetails=[];
    this.list=5;
    this.activeWizard2 =1;
   }

  fetchData(){
    this.showLiveAlert=false;

    
    switch(this.activeWizard2){
      case 1: this.firstFormSubmitted=true
      if(this.basicWizardForm.controls['organization_name'].valid &&this.basicWizardForm.controls['admin_name'].valid && this.basicWizardForm.controls['designation'].valid && this.basicWizardForm.controls['organization_email'].valid && this.basicWizardForm.controls['organization_mobile'].valid ){
  
          let data ={
              organization_name: this.basicWizardForm.value.organization_name,
              organization_email: this.basicWizardForm.value.organization_email,
              organization_mobile: '+91'+ this.basicWizardForm.value.organization_mobile
          };
          let user_data = {
            email: this.basicWizardForm.value.organization_email,
            mobile: '+91'+ this.basicWizardForm.value.organization_mobile
        };
          
      this.adminService.fetchOrgData(data).subscribe({
          next: (data:any)=>{    
            this.adminService.fetchUserDataIfExists(user_data).subscribe({
              next: (data:any)=>{    
                this.activeWizard2 = this.activeWizard2+1;
                this.errorMessageAPI='';
                this.showLiveAlertAPI=false;
              },
              error:(data:any)=>{
                console.log("error where")
                this.errorMessageAPI=data;
                this.showLiveAlertAPI=true;
              }
            })
          },
          error:(data:any)=>{
            this.errorMessageAPI=data;
            this.showLiveAlertAPI=true;
          }
        })
        this.firstFormSubmitted=false 
      }
      break;

      case 2:
        console.log('inside the case');
        this.secondFormSubmitted=true

        if(this.basicWizardForm.controls['country'].valid &&this.basicWizardForm.controls['zip'].valid && this.basicWizardForm.controls['state'].valid && this.basicWizardForm.controls['city'].valid && this.basicWizardForm.controls['address'].valid ){
          this.activeWizard2 = this.activeWizard2+1;
          this.secondFormSubmitted=false
        }
        break;
      case 3:  
      this.urlFormSubmitted=true
      if(this.basicWizardForm.controls['url'].valid){
      this.activeWizard2 = 4;
      this.urlFormSubmitted=false
      }
        break;  
      case 4:  
      if(this.listdetails.length>0 ){
        this.activeWizard2+= 1; 
      }
      break;


    }

//     if(this.activeWizard2 == 1){
//       this.firstFormSubmitted=true
//     if(this.basicWizardForm.controls['organization_name'].valid &&this.basicWizardForm.controls['admin_name'].valid && this.basicWizardForm.controls['designation'].valid && this.basicWizardForm.controls['organization_email'].valid && this.basicWizardForm.controls['organization_mobile'].valid ){

//         let data ={
//             organization_name: this.basicWizardForm.value.organization_name,
//             organization_email: this.basicWizardForm.value.organization_email,
//             organization_mobile: '+91'+ this.basicWizardForm.value.organization_mobile

//         };

//     this.adminService.fetchOrgData(data).subscribe({
//         next: (data:any)=>{
//           this.activeWizard2 = this.activeWizard2+1;
//           this.errorMessageAPI='';
//                 this.showLiveAlertAPI=false;
//         },
//         error:(data:any)=>{     
//                 this.errorMessageAPI=data;
//                 this.showLiveAlertAPI=true;
            
//         }
//     })
//     this.firstFormSubmitted=false

//     }
//   }
//   if(this.activeWizard2 == 2){
//     this.secondFormSubmitted=true
//     if(this.basicWizardForm.controls['country'].valid &&this.basicWizardForm.controls['zip'].valid && this.basicWizardForm.controls['state'].valid && this.basicWizardForm.controls['city'].valid && this.basicWizardForm.controls['address'].valid ){
//       this.activeWizard2 = this.activeWizard2+1;
//       this.secondFormSubmitted=false
//     }
//   }
//   if(this.activeWizard2 == 3){
//     this.urlFormSubmitted=true
//     if(this.basicWizardForm.controls['url'].valid){
      
//       this.activeWizard2 = 4;
//       console.log("wizard", this.activeWizard2);

//     this.urlFormSubmitted=false

    
//   }
// }
// if(this.activeWizard2 == 4){
//   if(this.listdetails.length>0 ){
//     this.activeWizard2+= 1; 
//   }
// }


  if(this.listdetails.length>0 ){
      console.log("hey manaf",this.listdetails[0]);
      if(this.listdetails[0].event==true&&this.listdetails[0].event_mode==null||this.listdetails[0].event_mode==0){
       
        this.validation=true
        
      }
  
    this.checkListDetailsForm()
  }
  }
  checkListDetailsForm(){

    if(this.activeWizard2==3){
      this.activeWizard2=4;
    }else{
      this.makeMove();
    }
  }
  checkInputValue(value: string){
    var patt = new RegExp(/^[a-zA-Z]+$/);
    var res = patt.test(value);
    console.log("res",res);
    
    if(!res){
      this.web_url_error_token = true
      this.web_url_error= 'Cannot contain spaces special characters'    }
    else this.web_url_error_token = false
}
    makeMove(){
    const selected = this.listdetails.findIndex(obj=>obj.index===this.activeWizard2);
    const prod = this.listdetails[selected];
    prod.productaccess_web===true ? (prod.web_url!):{}
    prod.pressed = true
    let satisfied1 = false;
    let satisfied2 = false;
    if(prod.productaccess_web===true){
      // var specialChars = new RegExp(/^[a-zA-Z]+$/);
      // console.log("length",(prod.web_url).length)
      // console.log("special char",specialChars.test(prod.web_url));
      // if((prod.web_url).length>2&&specialChars.test(prod.web_url)==true){
        satisfied1=true;
      // }
    }
    else{
      satisfied1=true;
      this.validation=true;
    }
    if(prod.event==true){
      if(prod.event_mode!==null&&prod.event_mode!==0){
        satisfied2=true;
      }
    }
    else{
      satisfied2=true;
      this.validation=true;
    }

    if(satisfied1&&satisfied2&&(prod.pilot_duration!=0&&prod.pilotduration_value==1||((prod.attempts!=null&&prod.pilotduration_value==2&&prod.attempts!=0)))){
      if(this.activeWizard2===this.list-1){
        this.checkingForm();
      }
      else{
        this.validation=false;
        this.activeWizard2 = this.activeWizard2+1;
      }
    }
  }


  daysLefts(date:any){
    const firstDate = new Date();
    const secondDate = new Date(date);
    const total_seconds = Math.abs(secondDate.valueOf() - firstDate.valueOf()) / 1000;  
    const days_difference = Math.floor (total_seconds / (60 * 60 * 24)); 
    return days_difference;
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
    this.srcImage = './assets/images/fedo-logo-white.png';

  }
  onSelect(event: any) {    
    this.files =[...event.addedFiles];
    this.srcImage = event.addedFiles;
    this.image= event.addedFiles[0];
  }
  getPreviewUrl(f: File) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(encodeURI(URL.createObjectURL(f)));
  }
  


  open(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { centered: true,keyboard : false, backdrop : 'static' , size:'lg'});
  }

  onSort(event: SortEvent): void {
    if (event.direction === '') {
      this.records = EMPLOYEES;
    } else {
      this.records = [...this.records].sort((a, b) => {
        const res = this.compare(a[event.column], b[event.column]);
        return event.direction === 'asc' ? res : -res;
      });
    }
  }

  compare(v1: string | number, v2: string | number): any {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  searchData(searchTerm: string): void {
    if (searchTerm === '') {
      this._fetchData();
    }
    else {
      let updatedData = EMPLOYEES;
      updatedData = updatedData.filter(record => this.matches(record, searchTerm));
      this.records = updatedData;
    }

  }

  _fetchData(): void {
    this.records = EMPLOYEES;
  }

  matches(row: Employee, term: string) {
    return row.name.toLowerCase().includes(term)
      || row.position.toLowerCase().includes(term)
      || row.office.toLowerCase().includes(term)
      || String(row.age).includes(term)
      || row.date.toLowerCase().includes(term)
      || row.salary.toLowerCase().includes(term);
  }

  checkingForm(){

    const selectedIndex = this.listdetails.findIndex(obj=>obj.prod_id===2);
    // if(this.listdetails[selectedIndex]?.web_url  == '' && this.listdetails[selectedIndex]?.productaccess_web){
    //   this.errorMessage='Web url in Vitals is a mandatory field';
    //   this.showLiveAlert=true;
    // }
    // else{
    var data = new FormData();
    data.append('organization_name',this.basicWizardForm.value.organization_name);
    data.append('designation', this.basicWizardForm.value.designation);
    data.append('admin_name', this.basicWizardForm.value.admin_name);
    data.append('organization_email', this.basicWizardForm.value.organization_email);
    data.append('organization_mobile','+91'+this.basicWizardForm.value.organization_mobile);
    data.append('fedo_score', this.listdetails.map(value=>value.fedo_score).toString());
    data.append('pilot_duration',this.listdetails.map(value=>value.pilot_duration).toString());
    data.append('product_id',this.listdetails.map(value=>value.prod_id).toString());
    data.append('productaccess_web',this.listdetails.map(value=>value.productaccess_web).toString());
    data.append('event_mode',this.listdetails.map(value=>value.event_mode).toString());
    data.append('ios_access',this.listdetails.map(value=>value.ios_access).toString());
    data.append('is_application_number',this.listdetails.map(value=>value.is_application_number).toString());
    // data.append('is_pilot_duration',this.listdetails.map(value=>value.is_pilot_duration).toString());
    // data.append('attempts',this.listdetails.map(value=>value.attempts).toString());
    data.append('productaccess_mobile',this.listdetails.map(value=>value.productaccess_mobile).toString());
    data.append('is_pilot_duration',this.listdetails.map(value=>value.is_pilot_duration).toString());
    data.append('attempts',this.listdetails.map(value=>value.attempts).toString());
    data.append('enable_questionnaire',this.listdetails.map(value=>value.enable_questionnaire).toString());
    data.append('enable_sms',this.listdetails.map(value=>value.enable_sms).toString());

    data.append('type','orgAdmin');
    data.append('url',this.basicWizardForm.value.url);
    data.append('country',this.basicWizardForm.value.country);
    data.append('industry_id',this.basicWizardForm.value.industry);
    data.append('zip',this.basicWizardForm.value.zip.toString());
    data.append('state',this.basicWizardForm.value.state);
    data.append('city',this.basicWizardForm.value.city);
    data.append('address',this.basicWizardForm.value.address);
    this.image==''? null:data.append('file', this.image, this.image.name)
    if(this.basicWizardForm.value.is_web == undefined || this.basicWizardForm.value.is_web == false){
      this.adminService.createOrg(data).subscribe({
      next: (res:any) => {
        this.org_name = res[0].organization_name;
        this.activeWizard2=this.activeWizard2+1;
        this.created = true;
      },
      error: (err) => {
        this.errorMessageAPI=err;
        this.showLiveAlertAPI=true;

      },
      complete: () => { }
    });}
    else 
    {
    data.append('password','Test@123');
    this.adminService.createOrgDirect(data).subscribe({
        next: (res:any) => {
          this.activeWizard2=this.activeWizard2+1;
          this.created = true;
          this.org_name = res[0].organization_name;
  
        },
        error: (err) => {
          this.errorMessageAPI=err;
          this.showLiveAlertAPI=true;
  
        },
        complete: () => { }
      });}
  // }
  } 

  resendInvitationMail(data:any){
    this.showLiveAlertResendInvitation = true;
    this.errorMessageResendInvitation = 'Invitation Successfully resent!'
    this.adminService.ResendInvitationMailForOrg({organisation_admin_name:data.admin_name,email:data.organization_email,org_id: data.id,url:data.url}).subscribe({
      next: (res) =>{
        
      },
      error : (err)=>{

      }
    })
  
    }
    
  onActiveStatus(data :any){
    this.activeStatusValue=data.value
    this.router.navigate([], {
      queryParams: {
        page: this.pagenumber,
        status : this.activeStatusValue,
        entry : this.entries
      },
    });

      this.adminService.fetchAllOrgByPage(this.pagenumber,this.entries,ACTIVE[this.activeStatusValue]).subscribe
    ((doc:any) =>{ 
      this.total_pages=doc.total_pages
      this.currentPage=doc.page
      this.total_org=doc.total
      this.tabDAta=doc.data; 
      this.length=this.tabDAta.length
      this.tabDAta = doc.sort((a: { id: number; },b: { id: number; })=> b.id-a.id);
      return doc},(err:any)=>{
        this.tabDAta = [];

      });

  }

  setEventMode(event: any,product:any,value:any){
    const selected = this.listdetails.findIndex(obj=>obj.name===product);
    this.listdetails[selected].event_mode = value ;
    if(this.listdetails[selected].event_mode!=null){
      this.validation=false
    }
  }

  pilotduration(event: any,product:any,value:any){
    const selected = this.listdetails.findIndex(obj=>obj.name===product);
    this.listdetails[selected].pilotduration_value = value ;
    // if(this.listdetails[selected].event_mode!=null){
    //   this.validation=false
    // }
    if(value==1){
      this.listdetails[selected].attempts = 0 ;
      
    }
    if(value==2){
      this.listdetails[selected].pilot_duration = 0 ;
      
    }
    
  }

  updateStatus(data:any,orgData:any){
    
    if(this.activeStatusValue == 'Active Org'){
      this.tabDAta = this.tabDAta.filter(obj => obj.id != orgData.id);      
    }
    else if(this.activeStatusValue == 'Inactive Org'){
      this.tabDAta = this.tabDAta.filter(obj => obj.id != orgData.id);
    }
    else if(this.activeStatusValue == 'All Org'){
      const selected = this.tabDAta.findIndex(obj => obj.id === orgData.id);
      this.tabDAta[selected].is_deleted = !data;
    }
    
    this.adminService.patchOrgStatus(orgData.id, orgData , data).subscribe({
      next: (res) => {
        if(data) {

          const prod:any = orgData.product.map((el:any)=>{
            return {
              fedo_score:el.fedoscore,
              pilot_duration: el.pilot_duration,
              product_junction_id:el.id,
              product_id: el.product_id,
              web_access: el.web_access,
              web_url: el.web_url ? el.web_url :'',
              web_fedoscore: el.web_access ? el.web_fedoscore:false,
              event_mode: el.event_mode,
              ios_access: el.ios_access ? el.ios_access:false ,
              enable_kiosk: el.enable_kiosk ? el.enable_kiosk:false,
              mobile_access: el.mobile_access ? el.mobile_access:false,
              is_application_number:el.is_application_number ? el.is_application_number:false,
              attempts:el.attempts ?el.attempts:0,
              is_pilot_duration:el.is_pilot_duration ? el.is_pilot_duration:false,
              enable_questionnaire:el.is_questionnaire ? el.is_questionnaire:false,
              enable_sms:el.enable_sms ? el.enable_sms:false,

              kiosk_user:el.kiosk_user ? el.kiosk_user:null,
              is_change : false
            }
          });

          this.updatePilotDuration(orgData.id,data,prod);
            
          this.adminService.sendEmailOnceOrgIsBackActive({organisation_admin_name:orgData.admin_name,organisation_admin_email:orgData.organization_email,email:orgData.organization_email}).subscribe({
            next: (res) =>{
              // this.reloadCurrentPage();
            },
            error : (err)=>{
              // this.reloadCurrentPage();
            }
          })
        }
        else{
          const prod:any = orgData.product.map((el:any)=>{
            return {
              fedo_score:el.fedoscore,
              pilot_duration: el.pilot_duration-(this.daysLefts(el.end_date))<0 ? 0 : this.daysLefts(el.end_date)+1,
              product_junction_id:el.id,
              product_id: el.product_id,
              web_access: el.web_access,
              web_url: el.web_url ? el.web_url :'',
              web_fedoscore: el.web_access ? el.web_fedoscore:false,
              event_mode: el.event_mode,
              is_application_number :el.is_application_number ? el.is_application_number :false,
              attempts: el.attempts ? el.attempts:0,
              is_pilot_duration:el.is_pilot_duration ? el.is_pilot_duration:false,
              enable_questionnaire:el.is_questionnaire ? el.is_questionnaire:false,
              enable_sms:el.enable_sms ? el.enable_sms:false,
              
              ios_access:el.ios_access ? el.ios_access:false,
              mobile_access:el.mobile_access ? el.mobile_access:false,
              enable_kiosk:el.enable_kiosk ? el.enable_kiosk:false,
              kiosk_user:el.kiosk_user ? el.kiosk_user:null,
              is_change : false,
            }
          });
          this.updatePilotDuration(orgData.id,data,prod);

        }
        this.adminService.fetchAllUserOfOrgByPage(orgData.id,1,10000,'').subscribe((doc:any)=>{
          doc.data.map((el:any)=>{
            const user_id=el.id
            this.adminService.patchUserStatus(el.id, data).subscribe({
              next: (res) => {
             console.debug(res)
              },
              error:(err)=>{
                console.debug(err)
              }
              
            })
            

            
          })
          
          
        })
        // this.reloadCurrentPage();
      },
    })

  }

  updatePilotDuration(id:any, data:any,prod:any){
    let datachunk = new FormData();
    datachunk.append('pilot_duration',prod.map((value:any) => value.pilot_duration).toString());

    datachunk.append('fedo_score',prod.map((value:any) => value.fedo_score).toString());
    datachunk.append('product_junction_id',prod.filter(((value:any)=> value.product_junction_id == '' ? false : true)).map((value:any) => value.product_junction_id).toString());
    datachunk.append('product_id',prod.map((value:any) => value.product_id).toString());
    datachunk.append('productaccess_web',prod.map((value:any) => value.web_access).toString());
    datachunk.append('web_url',prod.map((value:any) => value.web_url).toString());
    datachunk.append('web_fedoscore',prod.map((value:any) => value.web_fedoscore).toString());
    datachunk.append('event_mode',prod.map((value:any) => value.event_mode).toString());
    datachunk.append('is_application_number',prod.map((value:any) => value.is_application_number).toString());
    datachunk.append('attempts',prod.map((value:any) => value.attempts).toString());
    datachunk.append('is_pilot_duration',prod.map((value:any) => value.is_pilot_duration).toString());
    datachunk.append('enable_questionnaire',prod.map((value:any) => value.enable_questionnaire).toString());   
    datachunk.append('enable_sms',prod.map((value:any) => value.enable_sms).toString());   

    datachunk.append('is_change',prod.map((value:any) => value.is_change).toString());   
    datachunk.append('productaccess_mobile',prod.map((value:any) => value.mobile_access).toString());
    datachunk.append('ios_access',prod.map((value:any) => value.ios_access).toString());
    datachunk.append('enable_kiosk',prod.map((value:any) => value.enable_kiosk).toString());
    datachunk.append('kiosk_user',prod.map((value:any) => value.kiosk_user).toString()); 


    this.adminService.patchOrgDetails(id, datachunk).subscribe({
      next: (res) => {

      },
      error: (err) => {

      },
      complete: () => { }
    });
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



  demoFunction(event:any, product:any){

    if(event.target.checked){
      this.list++;
      let details={
        prod_id:product.id,
        name:product.product_name, 
        index:this.list-1, 
        pilot_duration:0,
        fedo_score:false,
        // web_fedoscore:false,
        productaccess_web: false,
        // web_url:'',
        event:false,
        event_mode:0,
        pressed:false,
        limitScans:false,
        scans:0,
        ios_access:false,
        // productaccess_web: false,
        productaccess_mobile: false,
        attempts : 0,
        is_pilot_duration : false,
        pilotduration_value : 0,
        is_application_number : false,
        enable_questionnaire : false,
        enable_sms : false

      };
      this.listdetails.push(details);
    }
    else{
      this.list--;
      const selected =this.listdetails.findIndex(obj=>obj.name===product.product_name);
      this.selectedProducts.slice(product.id,1);
      this.listdetails.splice(selected,1);
    }
  }

  get form1() { return this.basicWizardForm.controls; }


  ngstyle(){
    const stone = {'background': '#3B4F5F',
     'border': '1px solid #3E596D',
     'color': '#5FB6DB',
     'pointer-events': this.created ? 'none':'auto'
    }
 
   return stone
   }

   reloadCurrentPage() {
    window. location. reload();
    }


    searchOrg(event : any){
      if(event.target.value != null) this.org_search = event.target.value
      else if(this.org_search.length > 0){
        this.adminService.fetchAllOrgByName(this.pagenumber,this.entries,this.org_search).subscribe
      ((doc:any) =>{ 

        if(!doc.data){
          this.page = 0
        this.total_org=0
        this.currentPage=0
        this.total_pages=0
        this.tabDAta = [];
        
        this.length=0
        }
        else{
        this.page = this.pagenumber
        this.total_org=doc.total
        this.currentPage=doc.page
        this.total_pages=doc.total_pages
  
        this.tabDAta=doc.data;
        this.length=this.tabDAta.length
      
        return doc
      }
      });
      }
      
    }

  

}

export const ACTIVE: any = {
  'Active Org': 'false',
  'Inactive Org': 'true',
  'All Org': ''
}
