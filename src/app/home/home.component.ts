import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs';
import { AdminConsoleService } from '../services/admin-console.service';
// import { EventService } from 'src/app/core/service/event.service';
interface PersonDetails {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
};



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  activeWizard1: number = 1;
  activeWizard2: number = 1;
  activeWizard3: number = 1;
  activeWizard4: number = 1;

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
  persons: PersonDetails[] = [];
  organisationCount:any=0;
  vitalsCount:any=0;
  basicWizardForm!: FormGroup;
  progressWizardForm !: FormGroup;
  btnWizardForm !: FormGroup;
  accountForm!: FormGroup;
  profileForm!: FormGroup;
  validationWizardForm!: FormGroup;
  validationGroup1!: FormGroup
  tabDAta:any[]=[];
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  products:any[]=[];
  selectedProducts:any[]=[];
  userForm!: FormGroup;
  thirdParty: boolean = false;
  notThirdParty: boolean =false;
  codeList: any[] = [];
  showButton: boolean = true;
  userProduct:any[]=[];
  selectedUserProducts:any[]=[];
  organaization_id:any;
  created:boolean=false;
  showLiveAlertNextButton=false;
  formSubmitted=false

  errorMessageNextButton='';
  addTpafunc:boolean=false;
  urlFormSubmitted = false;

  changeButton:boolean=false

  validation:boolean=false
  web_url_error=''




  constructor(
    private readonly adminService: AdminConsoleService,
    private sanitizer: DomSanitizer, 
    private fb: FormBuilder,
    private modalService: NgbModal) { }

    showLiveAlertAPI=false;
    errorMessageAPI='';
    web_url_error_token= false


  ngOnInit(): void {
    // let data = sessionStorage.getItem('org_data');
    // console.log("jfghfh",this.tbDAta);
  
    
    
    
    this.list=4;
    this.adminService.fetchOrganisationCount().subscribe((doc:any)=>{this.organisationCount=doc['total_organizations_count']})
    this.adminService.fetchVitalsCount('vitals').subscribe((doc:any) =>{this.vitalsCount=doc['total_vitals_pilot_count']})
    this.adminService.fetchLatestOrg().subscribe((doc:any) =>{ this.tabDAta=doc.data;return doc});
    this.adminService.fetchProducts().subscribe((doc:any)=>{this.products=doc;return doc});
    // let org_id = this.organaization_id
 
    


    this.validationGroup1 = this.fb.group({
      organization_name: ['', Validators.required],
      admin_name:['',Validators.required],
      designation:['',Validators.required],
      organization_email:['',[Validators.required,Validators.email]],
      organization_mobile:['',[Validators.required]],
      url:['',[Validators.required]]
    });
    // initialize forms
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
        url:['',[Validators.required]]
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
  get validator() {
    return true;
  }
  //   get officialEmail() {
  //     return this.validationGroup1.get('organization_email');
  // }


  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
    this.srcImage = './assets/images/fedo-logo-white.png';

  }

  daysLefts(date:any){
    const firstDate = new Date();
    const secondDate = new Date(date);
    const total_seconds = Math.abs(secondDate.valueOf() - firstDate.valueOf()) / 1000;  
    const days_difference = Math.floor (total_seconds / (60 * 60 * 24)); 
    return days_difference;
  }

  onSelect(event: any) {
    // console.log('don');
    
    this.files =[...event.addedFiles];
    this.srcImage = event.addedFiles;
    this.image= event.addedFiles[0];
    console.log('the file ', event.addedFiles[0])

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
    // this shoulf also implement for the create organization for the web url thing 
    // if( this.listdetails[selectedIndex]?.productaccess_web == true){
    //   data.append('web_url',this.listdetails.map(value=>this.basicWizardForm.value.url==''?'':'vitals_'+this.basicWizardForm.value.url).toString());
    // }
    // else if( this.listdetails[selectedIndex]?.productaccess_web == false){
    //   data.append('web_url',this.listdetails.map(value=>value.web_url==''?'':'vitals_'+value.web_url).toString());
    // }
    data.append('organization_name',this.basicWizardForm.value.organization_name);
    data.append('designation', this.basicWizardForm.value.designation);
    data.append('admin_name', this.basicWizardForm.value.admin_name);
    data.append('organization_email', this.basicWizardForm.value.organization_email);
    data.append('organization_mobile','+91'+this.basicWizardForm.value.organization_mobile);
    data.append('fedo_score', this.listdetails.map(value=>value.fedo_score).toString());
    data.append('pilot_duration',this.listdetails.map(value=>value.pilot_duration).toString());
    data.append('product_id',this.listdetails.map(value=>value.prod_id).toString());
    data.append('productaccess_web',this.listdetails.map(value=>value.productaccess_web).toString());
    data.append('web_fedoscore',this.listdetails.map(value=>value.web_fedoscore).toString());
    data.append('web_url',this.listdetails.map(value=>value.web_url==''?'':'vitals_'+value.web_url).toString());
    data.append('event_mode',this.listdetails.map(value=>value.event_mode).toString());
    data.append('type','orgAdmin');
    data.append('url',this.basicWizardForm.value.url);
    console.log('this image => ,',this.image)
    this.image==''? null:data.append('file', this.image, this.image.name)
    console.log('the request body => ', data)
    this.adminService.createOrg(data).subscribe({
      next: (res:any) => {
        this.activeWizard1=this.activeWizard1+1;
        this.created = true;
        console.log('the success=>',res);
        this.org_name = res[0].organization_name;

      },
      error: (err) => {
        console.log('the failure=>',err);
        this.errorMessage=err;
        this.showLiveAlert=true;

      },
      complete: () => { }
    });
    }
  }

  setEventMode(event: any,product:any,value:any){
    console.log('the value => ',event);

    const selected = this.listdetails.findIndex(obj=>obj.name===product);
    this.listdetails[selected].event_mode = value ;
    if(this.listdetails[selected].event_mode!=null){
      this.validation=false
    }
    
  }

  eventmode(event:any, product:any){
    console.log("asd",event.target.checked)
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
    console.log("ersdfzdx",data.admin_name);
    this.adminService.ResendInvitationMailForOrg({organisation_admin_name:data.admin_name,email:data.organization_email,org_id: data.id,url:data.url})
  
    }

    updateStatus(data:any,orgData:any){
      // console.log("datat",data,orgData)
      this.adminService.patchOrgStatus(orgData.id, data).subscribe({
        next: (res) => {
          if(data) this.adminService.sendEmailOnceOrgIsBackActive({name:orgData.admin_name,email:orgData.organization_email})
          // console.log('the success=>',res);
          this.reloadCurrentPage();
          // this.activeWizard2=this.activeWizard2+1;
          // this.created=true;
        },
      })
      
  
    }

  demoFunction(event:any, product:any){
    console.log('asdf',event.target.checked);
    // console.log('donned',product)
    
    if(event.target.checked){
      // this.basicWizardForm.controls[product].setValue(true);
      this.list++;
      let details={
        prod_id:product.id,
        name:product.product_name, 
        index:this.list-1, 
        pilot_duration:0,
        fedo_score:false,
        web_fedoscore:false,
        productaccess_web: false,
        web_url:'',
        event:false,
        event_mode:0,
        pressed:false

      };
      this.listdetails.push(details);
    }
    else{
      this.list--;
      // this.basicWizardForm.controls[product].setValue(false);
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

    if(this.activeWizard1 == 1){
    if(this.basicWizardForm.controls['organization_name'].valid &&this.basicWizardForm.controls['admin_name'].valid && this.basicWizardForm.controls['designation'].valid && this.basicWizardForm.controls['organization_email'].valid && this.basicWizardForm.controls['organization_mobile'].valid ){

        let data ={
            organization_name: this.basicWizardForm.value.organization_name,
            organization_email: this.basicWizardForm.value.organization_email,
            organization_mobile: '+91'+ this.basicWizardForm.value.organization_mobile

        };
        console.log("hgxfshdgdata",data);
        
    this.adminService.fetchOrgData(data).subscribe({
        next: (data:any)=>{    
          this.activeWizard1 = this.activeWizard1+1;
          this.errorMessageAPI='';
          this.showLiveAlertAPI=false;
        },
        error:(data:any)=>{
          console.log('the error =>',data);     
          this.errorMessageAPI=data;
          this.showLiveAlertAPI=true;
          
        }
      })
    }
    }
    if(this.activeWizard1 == 2){
      this.urlFormSubmitted=true
      if(this.basicWizardForm.controls['url'].valid){
        //this should be implemented for web url in the readonly thinhg for create org variable shoulf be set above 
    // this.web_url_data = this.basicWizardForm.value.url

      this.activeWizard1 = 3;
      this.urlFormSubmitted=false

      }
    }



    if(this.listdetails.length>0 ){
    
      if(this.listdetails.length>0 ){
        console.log("hey manaf",this.listdetails[0]);
        if(this.listdetails[0].event==true&&this.listdetails[0].event_mode==null||this.listdetails[0].event_mode==0)
        {
          this.validation=true
        }
      }


      
      this.checkListDetailsForm()
      // this.activeWizard1 = this.activeWizard1+1;
    }

  }

  checkListDetailsForm(){

    if(this.activeWizard1==3){
      this.activeWizard1=4;
    }else{
      this.makeMove();
    }





    
    // this.activeWizard1 = this.activeWizard1+1;

  }
  checkInputValue(value: string){
    var patt = new RegExp(/^[a-zA-Z]+$/);
    var res = patt.test(value);
    console.log("res",res);
    
    if(!res){
      this.web_url_error_token = true
      this.web_url_error= 'Cannot contain spaces special characters'
    //fetch data from db and fill the second form
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
      console.log("length",(prod.web_url).length)
      console.log("special char",specialChars.test(prod.web_url));
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
        // prod.pressed = true
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
    this.list=4;
    this.activeWizard1 =1;
   }

   change() {
    this.thirdParty = this.notThirdParty;
    this.notThirdParty = !this.notThirdParty;


  }

  
  inputTpa() {
    this.userForm.get('third_party_org_name')?.value
    console.log("rsdfvfdxffdx", this.userForm.get('third_party_org_name')?.value)
    console.log("code", this.codeList);
    console.log("code",);
    if (this.codeList.includes(this.userForm.get('third_party_org_name')?.value)) {
      this.showButton = false;
      console.log("hello", this.showButton);
    }

    else {
      this.showButton = true;
    }
    this.userForm.get("third_party_org_name")?.valueChanges.subscribe(x => {
      // console.log('manafmannnu');
      this.changeButton=true
      this.addTpafunc=false
      console.log(x)
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
    console.log("fen boy",this.userForm.value);
    console.log('your boy', this.selectedUserProducts)
    this.userForm.controls['product_id'].setValue(this.selectedUserProducts.map(value => value.product_id).toString());
    this.userForm.value.third_party_org_name == null  ?     this.userForm.removeControl('third_party_org_name'): null;
    this.adminService.createUser(this.userForm.value).subscribe({
      next: (res:any) => {
       
        this.created = true;
        console.log('the success=>', res);
        this.user_name=res.user_name
        this.activeWizard2 = this.activeWizard2 + 1;
      },
      error: (err) => {
        console.log('the failure=>', err);
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
    console.log('see manaf', this.userProduct)
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

        // organization_name: this.userForm.controls['user_name'],

        email: this.userForm.value['email'],

        mobile: '+91'+ this.userForm.value['mobile']



    };

      this.adminService.fetchUserDataIfExists(data).subscribe({

        next: (data:any)=>{    

          this.activeWizard2=this.activeWizard2+1;
          this.showLiveAlertNextButton=false;


        },

        error: (err) => {

          console.log('the failure=>',err);
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
