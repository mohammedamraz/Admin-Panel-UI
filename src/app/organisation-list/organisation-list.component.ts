import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { USERS } from '../apps/chat/data';
import { Employee } from '../pages/tables/advanced/advance.model';
import { EMPLOYEES } from '../pages/tables/advanced/data';
import { AdminConsoleService } from '../services/admin-console.service';
import { Column } from '../shared/advanced-table/advanced-table.component';
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
  activeWizard3: number = 1;
  userWizard1:number =1;
  showLiveAlert=false;
  list: number = 4;
  userForm!: FormGroup;
  basicWizardForm!: FormGroup;
  errorMessage='';
  listdetails:any[]=[];
  tabDAta:any[]=[];
  tableData: any[] =EMPLOYEES;
  @Output() search = new EventEmitter<string>();
  records: Employee[] = [];
  columns: any[] = [];
  thirdParty=false;
  product='';
  userOrganisationName='';
  srcImage:any='./assets/images/fedo-logo-white.png';
  files: File[] = [];
  products:any[]=[];
  next:boolean=false;
  org_name: any
  user_name: string="";
  image:any=[];
  selectedProducts:any[]=[];
  // userForm!: FormGroup;
  // thirdParty: boolean = false;
  notThirdParty: boolean =true;
  codeList: any[] = [];
  showButton: boolean = true;
  userProduct:any[]=[];
  selectedUserProducts:any[]=[];
  organaization_id:any;
  created:boolean=false;

  length:any

  pageSizeOptions: number[] = [10, 20,30,40,50,60,70,80,90,100];
  activeStatusOptions:any= ['All Org', 'Active Org','Inactive Org']
  activeStatusValue: any= this.activeStatusOptions[0]
  
  entries:any=this.pageSizeOptions[0]
  pagenumber:any=1;
  total_pages:any;
  total_org:any;
  
  urlFormSubmitted = false
  currentPage:any;
  showLiveAlertAPI=false;
    errorMessageAPI='';

    validation:boolean=false
  web_url_error=''


  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private readonly adminService: AdminConsoleService,
    public service: AdvancedTableService,
    private sanitizer: DomSanitizer, 


  ) { }
  web_url_error_token= false

  ngOnInit(): void {
    

    // console.log("entries",this.entries)
    // console.log("optionsss",this.pageSizeOptions.values())
    this.adminService.fetchAllOrgByPage(this.pagenumber,this.entries,ACTIVE[this.activeStatusValue]).subscribe
    ((doc:any) =>{ 
      this.total_org=doc.total
      this.currentPage=doc.page
      this.total_pages=doc.total_pages

      // console.log('doc.......................',doc.data)
      this.tabDAta=doc.data; console.log('you are the one ', this.tabDAta)
      this.length=this.tabDAta.length
      console.log("hello00000",this.length);
      this.tabDAta = doc.sort((a: { id: number; },b: { id: number; })=> b.id-a.id);
      // this.length=this.tabDAta.length
      // console.log("hello00000",this.length);

      return doc});
    this.columns = this.tabDAta;

    this.adminService.fetchProducts().subscribe((doc:any)=>{this.products=doc;return doc})
    // this.adminService.fetchTpa(1).subscribe((doc: any) => {
    //   for (let i = 0; i <= doc.length - 1; i++) {
    //     if (doc[i].tpa_name != null) {
    //       this.codeList.push(doc[i].tpa_name)
    //     }

    //   }
   
    //     ; return doc;
    // })

    this.basicWizardForm = this.fb.group({
      organization_name:[''],
      admin_name:['',Validators.required],
      organization_email:['',[Validators.required,Validators.email]],
      organization_mobile:['',[Validators.required,  Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      fedo_score:[false],
      hsa:[false],
      ruw:[false],
      vitals:[false],
      designation:[''],
      url:['',Validators.required],
      pilot_duration:[''],
      product_name:[''],
    });

    this.userForm =this.fb.group({
      user_name: [''],
      designation: [''],
      email: [''],
      mobile: [''],
      org_id: [''],
      product_id: [''],
      third_party_org_name: [''],

    });
  }

  loadPage(val:any){
    this.pagenumber=val
    // console.log("fjhgvjgfjd",this.pagenumber);
    // console.log("entries",this.entries);

    this.adminService.fetchAllOrgByPage(this.pagenumber,this.entries,ACTIVE[this.activeStatusValue]).subscribe
    ((doc:any) =>{ 
      this.total_org=doc.total
      this.total_pages=doc.total_pages
      this.currentPage=doc.page
      // console.log('doc.......................',doc)
      this.tabDAta=doc.data
      
      // this.tabDAta = doc.sort((a: { id: number; },b: { id: number; })=> b.id-a.id);
      this.length=this.tabDAta.length
     
      return doc});
      this.columns = this.tabDAta;
      // console.log("heloooo",this.tabDAta);
      // this.onFilter(this.item)
     
      
      
      
    
  }

  onFilter (data:any) {
      this.entries=data.value
      
      // console.log("jhgfdhfh",this.entries);
      // console.log("page number",this.pagenumber)

      this.adminService.fetchAllOrgByPage(this.pagenumber,this.entries,ACTIVE[this.activeStatusValue]).subscribe
    ((doc:any) =>{ 
      this.total_pages=doc.total_pages
      this.currentPage=doc.page
      this.total_org=doc.total
      // console.log('doc.......................',doc)
      this.tabDAta=doc.data; console.log('you are the one ', this.tabDAta)
      this.length=this.tabDAta.length
      // console.log("hello00000",this.length);
      this.tabDAta = doc.sort((a: { id: number; },b: { id: number; })=> b.id-a.id);
      // this.length=this.tabDAta.length
      // console.log("hello00000",this.length);
      
      return doc});

    //  return data.value
     
      
  }


  clearform(){
    this.srcImage='./assets/images/fedo-logo-white.png';
    this.basicWizardForm.reset();
    this.listdetails=[];
    this.list=4;
    this.activeWizard2 =1;
   }
  


  fetchData(){
    this.showLiveAlert=false;

    if(this.activeWizard2 == 1){
    if(this.basicWizardForm.controls['organization_name'].valid &&this.basicWizardForm.controls['admin_name'].valid && this.basicWizardForm.controls['designation'].valid && this.basicWizardForm.controls['organization_email'].valid && this.basicWizardForm.controls['organization_mobile'].valid ){

        let data ={
            organization_name: this.basicWizardForm.value.organization_name,
            organization_email: this.basicWizardForm.value.organization_email,
            organization_mobile: '+91'+ this.basicWizardForm.value.organization_mobile

        };
        console.log("hgxfshdgdata",data);
        
    this.adminService.fetchOrgData(data).subscribe({
        next: (data:any)=>{
          
          
          
          this.activeWizard2 = this.activeWizard2+1;
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
  if(this.activeWizard2 == 2){
    this.urlFormSubmitted=true
    if(this.basicWizardForm.controls['url'].valid){
      this.activeWizard2 = 3;
    this.urlFormSubmitted=false

    }
  }

  if(this.listdetails.length>0 ){
    // if(this.listdetails.length>0 ){
      console.log("hey manaf",this.listdetails[0]);
      if(this.listdetails[0].event==true&&this.listdetails[0].event_mode==null||this.listdetails[0].event_mode==0)
      
      
      {
        this.validation=true
      
        
      }
    // }

    // this.activeWizard2 = this.activeWizard2+1;
    this.checkListDetailsForm()
  }
    // else{
    //     this.activeWizard2 = this.activeWizard2+1;
    // }
      


  }
  checkListDetailsForm(){

    if(this.activeWizard2==3){
      this.activeWizard2=4;
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
  
  // get form1() { return this.basicWizardForm.controls; }
  makeMove(){
    const selected = this.listdetails.findIndex(obj=>obj.index===this.activeWizard2);
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
        satisfied2=true;
      }
    }
    else{
      satisfied2=true;
      this.validation=true;
    }

    if(satisfied1&&satisfied2&&(prod.pilot_duration!=0)){
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
    // console.log('don');
    
    this.files =[...event.addedFiles];
    this.srcImage = event.addedFiles;
    this.image= event.addedFiles[0];
    console.log('the file ', event.addedFiles[0])

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

      //  filter
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
    if(this.listdetails[selectedIndex]?.web_url  == '' && this.listdetails[selectedIndex]?.productaccess_web){
      this.errorMessage='Web url in Vitals is a mandatory field';
      this.showLiveAlert=true;
    }
    else{
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
        console.log('the success=>',res);
        
        this.org_name = res[0].organization_name;
        this.activeWizard2=this.activeWizard2+1;
        this.created = true;
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

  // // checkingForm(){
  // //   var data = new FormData();
  // //   data.append('organization_name',this.basicWizardForm.value.organization_name);
  // //   data.append('designation', this.basicWizardForm.value.designation);
  // //   data.append('admin_name', this.basicWizardForm.value.admin_name);
  // //   data.append('organization_email', this.basicWizardForm.value.organization_email);
  // //   data.append('organization_mobile','+91'+this.basicWizardForm.value.organization_mobile);
  // //   data.append('fedo_score', this.listdetails.map(value=>value.fedo_score).toString());
  // //   data.append('pilot_duration',this.listdetails.map(value=>value.pilot_duration).toString());
  // //   data.append('product_id',this.listdetails.map(value=>value.prod_id).toString());
  // //   data.append('productaccess_web',this.listdetails.map(value=>value.productaccess_web).toString());
  // //   data.append('web_fedoscore',this.listdetails.map(value=>value.web_fedoscore).toString());
  // //   data.append('web_url',this.listdetails.map(value=>'https://www.fedo.ai/products/vitals'+value.web_url).toString());
  // //   data.append('type','orgAdmin');
  // //   data.append('url','https://www.fedo.ai/admin/vital/'+this.basicWizardForm.value.url);
  // //   console.log('this image => ,',this.image)
  // //   this.image==''? null:data.append('file', this.image, this.image.name)
  // //   console.log('the request body => ', data)
  // //   this.adminService.createOrg(data).subscribe({
  // //     next: (res:any) => {
  // //       console.log('the success=>',res);
  // //       this.org_name = res[0].organization_name;
  // //       this.activeWizard2=this.activeWizard2+1;
  // //     },
  // //     error: (err) => {
  // //       console.log('the failure=>',err);
  // //       this.errorMessage=err;
  // //       this.showLiveAlert=true;

  // //     },
  // //     complete: () => { }
  // //   });
  
  // }

  resendInvitationMail(data:any){
  console.log("ersdfzdx",data.admin_name);
  this.adminService.ResendInvitationMailForOrg({organisation_admin_name:data.admin_name,email:data.organization_email,org_id: data.id,url:data.url})

  }
    
  onActiveStatus(data :any){
    this.activeStatusValue=data.value
      
      // console.log("jhgfdhfh",this.entries);
      // console.log("page number",this.pagenumber)

      this.adminService.fetchAllOrgByPage(this.pagenumber,this.entries,ACTIVE[this.activeStatusValue]).subscribe
    ((doc:any) =>{ 
      this.total_pages=doc.total_pages
      this.currentPage=doc.page
      this.total_org=doc.total
      // console.log('doc.......................',doc)
      this.tabDAta=doc.data; console.log('you are the one ', this.tabDAta)
      this.length=this.tabDAta.length
      // console.log("hello00000",this.length);
      this.tabDAta = doc.sort((a: { id: number; },b: { id: number; })=> b.id-a.id);
      // this.length=this.tabDAta.length
      // console.log("hello00000",this.length);
      
      return doc});

  }


  setEventMode(event: any,product:any,value:any){
    console.log('the value => ',event);

    const selected = this.listdetails.findIndex(obj=>obj.name===product);
    this.listdetails[selected].event_mode = value ;
    if(this.listdetails[selected].event_mode!=null){
      this.validation=false
    }
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



  demoFunction(event:any, product:any){
    console.log('asdf',event.target.checked);
    console.log('donned',product)
    
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

  demoUserFunction(event:any, product:any){
    console.log('the form values => ',this.userForm.value)

    this.userForm.removeControl('ruw');
    this.userForm.removeControl('hsa');
    this.userForm.removeControl('vitals');
    this.userForm.value.third_party_org_name.length === '' ? this.userForm.removeControl('third_party_org_name'):null
    this.userForm.controls['product_name'].setValue(this.product);
    this.userForm.controls['organization_name'].setValue(this.userOrganisationName);
    this.adminService.createUser(this.userForm.value).subscribe({
      next: (res:any) => {
        console.log('the success=>',res);
        this.user_name=res.user_name

        this.userWizard1=this.userWizard1+1;
        // {this.snackBar.open("Pilot Created Successfully",'X', { duration: 5000, verticalPosition: 'bottom', horizontalPosition: 'center', panelClass: 'green'})}
        // this.formGroupDirective?.resetForm();
      },
      error: (err) => {
        console.log('the failure=>',err);
        this.errorMessage=err;
        this.showLiveAlert=true;
      //    { this.snackBar.open(err.error.message,'', {
      //   duration: 5000, verticalPosition: 'bottom', horizontalPosition: 'center', panelClass: 'red'
      // }); }
      },
      complete: () => { }
    });
  }
  get form1() { return this.basicWizardForm.controls; }

  paginate(): void {
    // paginate
    this.service.totalRecords = this.tableData.length;
    if (this.service.totalRecords === 0) {
      this.service.startIndex = 0;
    }
    else {
      this.service.startIndex = ((this.service.page - 1) * this.service.pageSize) + 1;
    }
    this.service.endIndex = Number((this.service.page - 1) * this.service.pageSize + this.service.pageSize);
    if (this.service.endIndex > this.service.totalRecords) {
      this.service.endIndex = this.service.totalRecords;
    }
  }
  change() {
    this.thirdParty = !this.thirdParty;
    this.notThirdParty = !this.thirdParty;


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

  }
  addTpa() {
    let input = this.userForm.get('third_party_org_name')?.value
    let org_id = this.organaization_id
    console.log("11111111111111",this.organaization_id);
    
    this.adminService.addTpa({ tpa_name: input, org_id: org_id }).subscribe((doc: any) => {
      // console.log("jhfgdjgj", typeof (input));

      // console.log("", doc);
      ; return doc;
    })
  }

  checkingUserForm(){
    this.userForm.controls['product_id'].setValue(this.selectedUserProducts.map(value => value.product_id).toString());
    this.userForm.value.third_party_org_name == null  ?     this.userForm.removeControl('third_party_org_name'): null;
    this.adminService.createUser(this.userForm.value).subscribe({
      next: (res) => {
        console.log('the success=>', res);
        this.activeWizard2 = this.activeWizard2 + 1;
      },
      error: (err) => {
        console.log('the failure=>', err);
        this.errorMessage = err;
        this.showLiveAlert = true;

      },
      complete: () => { }
    });
  }

  setValue(doc: any){
    this.userForm.reset();
    this.userForm.controls['org_id'].setValue(doc.id);
    console.log('hey manaf =>',doc);
    this.organaization_id=doc.id

    this.userProduct = doc.product.map((val: any) =>({product_name: val.product_id === '1' ? 'HSA' : (val.product_id === '2' ? 'Vitals':'RUW' ), product_id: val.product_id}))
    console.log('see manaf', this.userProduct)

    this.adminService.fetchTpa(this.organaization_id).subscribe((doc: any) => {
      // console.log("fetch tpaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",doc);
      
      for (let i = 0; i <= doc.length - 1; i++) {
        if (doc[i].tpa_name != null) {
          this.codeList.push(doc[i].tpa_name)
        }

      }
   
        ; return doc;
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
  nextDisabled(){
    return this.basicWizardForm.controls['organization_name'].valid && this.basicWizardForm.controls['admin_name'].valid && this.basicWizardForm.controls['designation'].valid && this.basicWizardForm.controls['organization_email'].valid && this.basicWizardForm.controls['organization_mobile'].valid  
  }
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

  

}

export const ACTIVE: any = {
  'Active Org': 'false',
  'Inactive Org': 'true',
  'All Org': ''
}
