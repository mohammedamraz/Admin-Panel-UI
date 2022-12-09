import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminConsoleService } from '../services/admin-console.service';
import { COUNTRIES } from './data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  activeWizard1: number = 1;
  activeWizard2: number = 1;
  list: number = 4;
  listdetails:any[]=[];
  next:boolean=false;
  showLiveAlert=false;
  errorMessage='';
  files: File[] = [];
  srcImage:any='./assets/images/fedo-logo-white.png';
  image:any=[];
  org_name: string="fedo";
  user_name: string="fedo";
  organisationCount:any=0;
  vitalsCount:any=0;
  basicWizardForm!: FormGroup;
  tabDAta:any[]=[];
  products:any[]=[];
  selectedProducts:any[]=[];
  userForm!: FormGroup;
  thirdParty: boolean = false;
  notThirdParty: boolean =false;
  codeList: any[] = [];
  showButton: boolean = true;
  widgetCounts:any[] = [];
  userProduct:any[]=[];
  selectedUserProducts:any[]=[];
  organaization_id:any;
  created:boolean=false;
  showLiveAlertNextButton=false;
  formSubmitted=false
  showLiveAlertResendInvitation =false
  errorMessageNextButton='';
  addTpafunc:boolean=false;
  urlFormSubmitted = false;
  firstFormSubmitted = false
  secondFormSubmitted = false
  changeButton:boolean=false
  validation:boolean=false
  web_url_error=''
  errorMessageResendInvitation = ' '
  showLiveAlertAPI=false;
  errorMessageAPI='';
  web_url_error_token= false
  countryList=COUNTRIES;
  locationValue:any=''
  stateValue:any=''

  constructor(
    private readonly adminService: AdminConsoleService,
    private sanitizer: DomSanitizer, 
    private fb: FormBuilder,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.list=4;
    this.adminService.fetchOrganisationCount().subscribe((doc:any)=>{this.organisationCount=doc['total_organizations_count']})
    this.adminService.fetchVitalsCount('vitals').subscribe((doc:any) =>{this.vitalsCount=doc['total_vitals_pilot_count']})
    this.adminService.fetchLatestOrg().subscribe((doc:any) =>{ this.tabDAta=doc.data});
    this.adminService.fetchProducts().subscribe((doc:any)=>{this.products=doc.filter((doc: { id: number; }) => doc.id !=  1);doc.forEach( (prod:any) =>{this.fetchCounts(prod)})});    

      this.basicWizardForm = this.fb.group({
        organization_name:['',Validators.required],
        admin_name:['',Validators.required],
        organization_email:['',[Validators.required,Validators.email]],
        organization_mobile:['',[Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
        fedo_score:[false],
        hsa:[false],
        ruw:[false],
        vitals:[false],
        designation:['',Validators.required],
        pilot_duration:['',Validators.required],
        product_name:[''],
        url:['',[Validators.required]],
        country:['',[Validators.required]],
        zip:['',[Validators.required,Validators.pattern("^[0-9]{6}$")]],
        state:['',[Validators.required]],
        city:['',[Validators.required]],
        address:['',[Validators.required]],
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


  get validator() {
    return true;
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
    this.srcImage = './assets/images/fedo-logo-white.png';

  }

  fetchCounts(prod:any){
 
     this.adminService.fetchVitalsCount(prod.product_name).subscribe(
      (doc:any) =>{
        if(prod.id != 1 ){
          this.widgetCounts.push ({
          id: prod.id,
          name: prod.id === 1 ? 'HSA' :(prod.id === 2 ? 'Vitals':'RUW'),
          count:   doc[`total_${prod.product_name}_pilot_count`],
          color:  prod.id === 1 ? '#F08FC9' :(prod.id === 2 ? '#F2CA65':'#FF9632')
        })}
      });
  }

  daysLefts(date:any){
    const firstDate = new Date();
    const secondDate = new Date(date);
    const total_seconds = Math.abs(secondDate.valueOf() - firstDate.valueOf()) / 1000;  
    const days_difference = Math.floor (total_seconds / (60 * 60 * 24)); 
    return days_difference;
  }

  onSelect(event: any) {
    this.files =[...event.addedFiles];
    this.srcImage = event.addedFiles;
    this.image= event.addedFiles[0];
  }

  open(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { centered: true,keyboard : false, backdrop : 'static' , size: 'lg' });
  }

  openUserForm(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { centered: true,keyboard : false, backdrop : 'static' });
  }

  checkingForm(){

    const selectedIndex = this.listdetails.findIndex(obj=>obj.prod_id===2);
    if(this.listdetails[selectedIndex]?.web_url  == '' && this.listdetails[selectedIndex]?.productaccess_web){
      this.errorMessage='Web url in Vitals is a mandatory field';
      this.showLiveAlert=true;
    }
    else{
    var data = new FormData();
    console.log('the list details ', this.listdetails)
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
    data.append('productaccess_mobile',this.listdetails.map(value=>value.productaccess_mobile).toString());
    data.append('type','orgAdmin');
    data.append('url',this.basicWizardForm.value.url);
    data.append('country',this.basicWizardForm.value.country);
    data.append('zip',this.basicWizardForm.value.zip.toString());
    data.append('state',this.basicWizardForm.value.state);
    data.append('city',this.basicWizardForm.value.city);
    data.append('address',this.basicWizardForm.value.address);
    this.image==''? null:data.append('file', this.image, this.image.name)
    console.log('the date we have =>', data)
    this.adminService.createOrg(data).subscribe({
      next: (res:any) => {
        this.activeWizard1=this.activeWizard1+1;
        this.created = true;
        this.org_name = res[0].organization_name;

      },
      error: (err) => {
        this.errorMessage=err;
        this.showLiveAlert=true;

      },
      complete: () => { }
    });
    }
  }

  setEventMode(event: any,product:any,value:any){
    const selected = this.listdetails.findIndex(obj=>obj.name===product);
    this.listdetails[selected].event_mode = value ;
    if(this.listdetails[selected].event_mode!=null){
      this.validation=false
    }
    
  }

  eventmode(event:any, product:any){
    if(event.target.checked ==  true){
      const selected =this.listdetails.findIndex(obj=>obj.name===product);
      this.listdetails[selected].event_mode = null;  
    }
    else if (event.target.checked===false){
      const selected =this.listdetails.findIndex(obj=>obj.name===product);
      this.listdetails[selected].event_mode=0;  
    }
  }

  resendInvitationMail(data:any){
    this.showLiveAlertResendInvitation = true;
    this.errorMessageResendInvitation = 'Invitation Successfully resent!'
    this.adminService.ResendInvitationMailForOrg({organisation_admin_name:data.admin_name,email:data.organization_email,org_id: data.id,url:data.url}).subscribe({
      next: (res) =>{
        console.log("dsasyfjewbsd",res)
        
      },
      error : (err)=>{
        console.log("ewdfsxc",err)

      }
    })
  
    }

    updateStatus(data:any,orgData:any){
      this.adminService.patchOrgStatus(orgData.id, data).subscribe({
        next: (res) => {
          if(data) {
            const prod:any = orgData.product.map((el:any)=>{
              return {
                fedo_score:el.fedoscore,
                pilot_duration: el.pilot_duration,
                product_junction_id:el.id,
                product_id: el.product_id,
                web_access: el.web_access,
                web_url: el.web_access ? el.web_url :'',
                web_fedoscore: el.web_access ? el.web_fedoscore:false,
                event_mode: el.event_mode
              }
            });
  
            this.updatePilotDuration(orgData.id,data,prod);
  
            this.adminService.sendEmailOnceOrgIsBackActive({organisation_admin_name:orgData.admin_name,organisation_admin_email:orgData.organization_email,email:orgData.organization_email}).subscribe({
              next: (res) =>{
                this.reloadCurrentPage();
              },
              error : (err)=>{
                this.reloadCurrentPage();
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
                web_url: el.web_access ? el.web_url :'',
                web_fedoscore: el.web_access ? el.web_fedoscore:false,
                event_mode: el.event_mode
              }
            });
            this.updatePilotDuration(orgData.id,data,prod);
  
          }
          this.reloadCurrentPage();
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
  
      this.adminService.patchOrgDetails(id, datachunk).subscribe({
        next: (res) => {
          console.log('the success=>',res);
  
        },
        error: (err) => {
          console.log('the failure=>',err);
  
        },
        complete: () => { }
      });
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
        // web_url:'',
        event:false,
        event_mode:0,
        pressed:false,
        limitScans:false,
        scans:0,
        ios_access:false,
        productaccess_web: false,
        productaccess_mobile: false


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

  getPreviewUrl(f: File) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(encodeURI(URL.createObjectURL(f)));
  }

  fetchData(){
    this.showLiveAlert=false;

    switch(this.activeWizard1){
      case 1: this.firstFormSubmitted=true
      if(this.basicWizardForm.controls['organization_name'].valid &&this.basicWizardForm.controls['admin_name'].valid && this.basicWizardForm.controls['designation'].valid && this.basicWizardForm.controls['organization_email'].valid && this.basicWizardForm.controls['organization_mobile'].valid ){
  
          let data ={
              organization_name: this.basicWizardForm.value.organization_name,
              organization_email: this.basicWizardForm.value.organization_email,
              organization_mobile: '+91'+ this.basicWizardForm.value.organization_mobile
          };
          
      this.adminService.fetchOrgData(data).subscribe({
          next: (data:any)=>{    
            this.activeWizard1 = this.activeWizard1+1;
            this.errorMessageAPI='';
            this.showLiveAlertAPI=false;
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
          this.activeWizard1 = this.activeWizard1+1;
          this.secondFormSubmitted=false
        }
        break;
      case 3:  
      this.urlFormSubmitted=true
      if(this.basicWizardForm.controls['url'].valid){
      this.activeWizard1 = 4;
      this.urlFormSubmitted=false
      }
        break;  
      case 4:  
      if(this.listdetails.length>0 ){
        this.activeWizard1+= 1; 
      }
      break;


    }



    // if(this.activeWizard1 == 1){
    //   this.firstFormSubmitted=true
    // if(this.basicWizardForm.controls['organization_name'].valid &&this.basicWizardForm.controls['admin_name'].valid && this.basicWizardForm.controls['designation'].valid && this.basicWizardForm.controls['organization_email'].valid && this.basicWizardForm.controls['organization_mobile'].valid ){

    //     let data ={
    //         organization_name: this.basicWizardForm.value.organization_name,
    //         organization_email: this.basicWizardForm.value.organization_email,
    //         organization_mobile: '+91'+ this.basicWizardForm.value.organization_mobile
    //     };
        
    // this.adminService.fetchOrgData(data).subscribe({
    //     next: (data:any)=>{    
    //       this.activeWizard1 = this.activeWizard1+1;
    //       this.errorMessageAPI='';
    //       this.showLiveAlertAPI=false;
    //     },
    //     error:(data:any)=>{
    //       this.errorMessageAPI=data;
    //       this.showLiveAlertAPI=true;
    //     }
    //   })
    //   this.firstFormSubmitted=false 
    // }
    // }
    // if(this.activeWizard1 == 2){
    //   this.secondFormSubmitted=true

    //   if(this.basicWizardForm.controls['country'].valid &&this.basicWizardForm.controls['zip'].valid && this.basicWizardForm.controls['state'].valid && this.basicWizardForm.controls['city'].valid && this.basicWizardForm.controls['address'].valid ){
    //     this.activeWizard1 = this.activeWizard1+1;
    //     this.secondFormSubmitted=false
    //   }

    // }
    // if(this.activeWizard1 == 3){
    //   this.urlFormSubmitted=true
    //   if(this.basicWizardForm.controls['url'].valid){
    //   this.activeWizard1 = 4;
    //   this.urlFormSubmitted=false
    //   }
    // }
    // if(this.activeWizard1 == 4){
    //   if(this.listdetails.length>0 ){
    //     this.activeWizard1+= 1; 
    //   }
    // }
    if(this.listdetails.length>0 ){
    
      if(this.listdetails.length>0 ){
        console.log("hey manaf",this.listdetails[0]);
        if(this.listdetails[0].event==true&&this.listdetails[0].event_mode==null||this.listdetails[0].event_mode==0)
        {
          this.validation=true
        }
      }

      this.checkListDetailsForm()
    }

  }

  checkListDetailsForm(){

    if(this.activeWizard1==4){
      this.activeWizard1=4;
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
      this.web_url_error= 'Cannot contain spaces special characters'
    }
    else this.web_url_error_token = false
}

  get form1() { return this.basicWizardForm.controls; }

   makeMove(){
    const selected = this.listdetails.findIndex(obj=>obj.index===this.activeWizard1);
    console.log('the modelal =>',this.listdetails[selected])
    const prod = this.listdetails[selected];
    prod.productaccess_web===true ? (prod.web_url!):{}
    prod.pressed = true
    let satisfied1 = false;
    let satisfied2 = false;
    if(prod.productaccess_web===true){
      var specialChars = new RegExp(/^[a-zA-Z]+$/);
      if((prod.web_url).length>2&&specialChars.test(prod.web_url)==true){ 
        satisfied1=true;       
      }
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
    
    if(satisfied1&&satisfied2&&(prod.pilot_duration!=0)){
      if(this.activeWizard1===this.list-1){
        this.checkingForm();
      }
      else{
        
        this.validation=false;
        this.activeWizard1 = this.activeWizard1+1;
      }
    }
    
  }


   clearform(){
    this.srcImage='./assets/images/fedo-logo-white.png';
    this.basicWizardForm.reset();
    this.listdetails=[];
    this.list=5;
    this.activeWizard1 =1;
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
    this.addTpafunc=true
    let input = this.userForm.get('third_party_org_name')?.value
    let org_id = this.organaization_id
    this.adminService.addTpa({ tpa_name: input, org_id: org_id }).subscribe((doc: any) => {   ; return doc;
    
      
    })
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

  setValue(doc: any){
    this.userForm.reset();
    this.userForm.controls['org_id'].setValue(doc.id);
    console.log('hey manaf =>',doc);
    this.organaization_id=doc.id

    this.adminService.fetchTpa(this.organaization_id).subscribe((doc: any) => { 
      for (let i = 0; i <= doc.length - 1; i++) {
        if (doc[i].tpa_name != null) {
          this.codeList.push(doc[i].tpa_name)
        }
      }  
        ; return doc;
    })
    this.userProduct = doc.product.map((val: any) =>({product_name: val.product_id === '1' ? 'HSA' : (val.product_id === '2' ? 'Vitals':'RUW' ), product_id: val.product_id}))
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
  reloadCurrentPage() {
    window. location. reload();
    }

  ngstyle(){
   const stone = {'background': '#3B4F5F',
    'border': '1px solid #3E596D',
    'color': '#5FB6DB',
    'pointer-events': this.created ? 'none':'auto'
  }
    return stone
  }

  nextDisabled(){
    return this.basicWizardForm.controls['organization_name'].valid && this.basicWizardForm.controls['admin_name'].valid && this.basicWizardForm.controls['designation'].valid && this.basicWizardForm.controls['organization_email'].valid && this.basicWizardForm.controls['organization_mobile'].valid  
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
