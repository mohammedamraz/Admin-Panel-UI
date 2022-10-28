import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { ACTIVE } from '../organisation-list/organisation-list.component';
import { AdminConsoleService } from '../services/admin-console.service';
import { AdvancedTableService } from '../shared/advanced-table/advanced-table.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  page=1
  // activeWizard1: number = 1;
  activeWizard2: number = 1;
  // activeWizard3: number = 1;
  // activeWizard4: number = 1;


  basicWizardForm!: FormGroup;
  notThirdParty: boolean =false ;
  codeList: any[] = [];
  showButton: boolean = true ;
  organaization_id:any;
  userProduct:any[]=[];
  selectedUserProducts:any[]=[];
  image:any=[];
  org_name:any
  formSubmitted=false


  

  constructor(
    private readonly route: ActivatedRoute,
    private readonly adminService: AdminConsoleService,
    public service: AdvancedTableService,
    private modalService: NgbModal,
    private fb: FormBuilder,


  ) { }

  snapshotParam:any = "initial value";
  userList:any[]=[];
  userForm!: FormGroup;
  userWizard1:number =1;
  list: number = 3;
  thirdParty=false;
  product='';
  listdetails:any[]=[];
  showLiveAlert=false;
  errorMessage='';
  userOrganisationName='';
  user_name: string="fedo";
  products:any[]=[];
  selectedProducts:any[]=[];
  organisationCount:any=0;
  vitalsCount:any=0;
  tabDAta:any[]=[];
  tableData:any[]=[];
  created:boolean=false;
  showLiveAlertNextButton=false;
  addTpafunc:boolean=false;

  errorMessageNextButton='';

  length:any

  pageSizeOptions: number[] = [10, 20,30,40,50,60,70,80,90,100];

  
  entries:any=this.pageSizeOptions[0]
  pagenumber:any=1;
  total_pages:any;
  total_user:any;
  
  currentPage:any;
  showLiveAlertAPI=false;
  errorMessageAPI='';
  activeStatusOptions:any= ['All Users', 'Active Users','Inactive Users']
  activeStatusValue: any= this.activeStatusOptions[0]
  changeButton:boolean=false

  ngOnInit(): void {
    this.adminService.fetchOrganisationCount().subscribe((doc:any)=>{this.organisationCount=doc['total_organizations_count']})
    this.adminService.fetchVitalsCount('vitals').subscribe((doc:any) =>{this.vitalsCount=doc['total_vitals_pilot_count']})
    this.adminService.fetchLatestOrg().subscribe((doc:any) =>{ this.tabDAta=doc;return doc});
    this.snapshotParam = this.route.snapshot.paramMap.get("orgId");

    // this.adminService.fetchAllUserOfOrg(this.snapshotParam).subscribe({
    //  next:(res:any)=>{{console.log('asdfasdf',res);this.userList=res.sort((a: { id: number; },b: { id: number; })=> b.id-a.id);}}
    // })

// pagination function starts

     // console.log("entries",this.entries)
    // console.log("optionsss",this.pageSizeOptions.values())
    this.adminService.fetchAllUserOfOrgByPage(this.snapshotParam,this.pagenumber,this.entries,ACTIVE[this.activeStatusValue]).subscribe
    ((doc:any) =>{ 
      this.total_user=doc.total
      this.currentPage=doc.page
      this.total_pages=doc.total_pages

      // console.log('doc.......................',doc.data)
      this.userList=doc.data; console.log('you are the one ', this.userList)
      this.length=this.userList.length
      console.log("hello00000",this.length);
      this.userList = doc.sort((a: { id: number; },b: { id: number; })=> b.id-a.id);
      // this.length=this.tabDAta.length
      // console.log("hello00000",this.length);

      return doc});


// pagination ends
    

    this.adminService.fetchOrgById(this.snapshotParam).subscribe({
      next:(res:any) =>{
        this.tableData=res
        this.userOrganisationName= res[0].organization_name;
      }})

      this.list=4;
      // this.adminService.fetchOrganisationCount().subscribe((doc:any)=>{this.organisationCount=doc['total_organizations_count']})
      // this.adminService.fetchVitalsCount().subscribe((doc:any) =>{this.vitalsCount=doc['total_vitals_pilot_count']})
      // this.adminService.fetchLatestOrg().subscribe((doc:any) =>{ this.tabDAta=doc;return doc});
     
      

      this.basicWizardForm = this.fb.group({
        organization_name:['',Validators.required],
        admin_name:['',Validators.required],
        organization_email:['',[Validators.required,Validators.email]],
        organization_mobile:['',[Validators.required]],
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
        user_name: ['',Validators.required, ],
        designation: ['',Validators.required],
        email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
        mobile: ['',[Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
        org_id: [''],
        product_id: [''],
        third_party_org_name: ['',Validators.required],

      });


  }

// pagination function starts


  loadPage(val:any){
    this.pagenumber=val
    // console.log("fjhgvjgfjd",this.pagenumber);
    // console.log("entries",this.entries);

    this.adminService.fetchAllUserOfOrgByPage(this.snapshotParam,this.pagenumber,this.entries,ACTIVE[this.activeStatusValue]).subscribe
    ((doc:any) =>{ 
      this.total_user=doc.total
      this.total_pages=doc.total_pages
      this.currentPage=doc.page
      // console.log('doc.......................',doc)
      this.userList=doc.data
      
      // this.tabDAta = doc.sort((a: { id: number; },b: { id: number; })=> b.id-a.id);
      this.length=this.userList.length
     
      return doc});
      // this.columns = this.tabDAta;
      // console.log("heloooo",this.tabDAta);
      // this.onFilter(this.item)
     
      
      
      
    
  }

  updateStatus(data:any,userData:any){
    // console.log("datat",data)
    this.adminService.patchUserStatus(userData.id, data).subscribe({
      next: (res) => {
        console.log('the success=>',data);
        if(data) this.adminService.sendEmailOnceUserIsBackActive({name:userData.user_name,email:userData.email})
        this.reloadCurrentPage();
        // this.activeWizard2=this.activeWizard2+1;
        // this.created=true;
      }
    })

  }

  resendInvitationMail(data:any){
    console.log("ersdfzdx",data);
    this.adminService.ResendInvitationMailForUser({name:data.user_name,email:data.email,user_id: data.id,url:this.tableData[0].url,organisation_name:this.tableData[0].organization_name})
  
    }

  onFilter (data:any) {
      this.entries=data.value
      
      // console.log("jhgfdhfh",this.entries);
      // console.log("page number",this.pagenumber)

      this.adminService.fetchAllUserOfOrgByPage(this.snapshotParam,this.pagenumber,this.entries,ACTIVE[this.activeStatusValue]).subscribe
    ((doc:any) =>{ 
      this.total_pages=doc.total_pages
      this.currentPage=doc.page
      this.total_user=doc.total
      // console.log('doc.......................',doc)
      this.userList=doc.data; console.log('you are the one ', this.userList)
      this.length=this.userList.length
      // console.log("hello00000",this.length);
      this.userList = doc.sort((a: { id: number; },b: { id: number; })=> b.id-a.id);
      // this.length=this.tabDAta.length
      // console.log("hello00000",this.length);
      
      return doc});

    //  return data.value
     
      
  }

  onActiveStatus(data :any){
    this.activeStatusValue=data.value
      
      // console.log("jhgfdhfh",this.entries);
      // console.log("page number",this.pagenumber)

      this.adminService.fetchAllUserOfOrgByPage(this.snapshotParam,this.pagenumber,this.entries,ACTIVE[this.activeStatusValue]).subscribe
    ((doc:any) =>{ 
      this.total_pages=doc.total_pages
      this.currentPage=doc.page
      this.total_user=doc.total
      // console.log('doc.......................',doc)
      this.userList=doc.data; console.log('you are the one ', this.userList)
      this.length=this.userList.length
      // console.log("hello00000",this.length);
      this.userList = doc.sort((a: { id: number; },b: { id: number; })=> b.id-a.id);
      // this.length=this.tabDAta.length
      // console.log("hello00000",this.length);
      
      return doc});

  }

// pagination func endsss
  
  checkingForm(){
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
    data.append('web_url',this.listdetails.map(value=>value.web_url==''?'null':'vitals_'+value.web_url).toString());
    data.append('type','orgAdmin');
    data.append('url',this.basicWizardForm.value.url);
    console.log('this image => ,',this.image)
    this.image==''? null:data.append('file', this.image, this.image.name)
    console.log('the request body => ', data)
    this.adminService.createOrg(data).subscribe({
      next: (res:any) => {
        this.activeWizard2=this.activeWizard2+1;
        console.log('the success=>',res);
        this.org_name = res.organization_name;
      },
      error: (err) => {
        console.log('the failure=>',err);
        this.errorMessage=err;
        this.showLiveAlert=true;

      },
      complete: () => { }
    });
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
        pilot_duration:15,
        fedo_score:false,
        web_fedoscore:false,
        productaccess_web: false,
        web_url:''
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
    this.addTpafunc=true;
    let input = this.userForm.get('third_party_org_name')?.value
    let org_id = this.organaization_id
    this.adminService.addTpa({ tpa_name: input, org_id: org_id }).subscribe((doc: any) => {   ; return doc;
    })
  }

  setValue(doc: any){
    this.userForm.reset();
    this.thirdParty = false;
    this.errorMessage = '';
    this.showLiveAlert = false;
    this.userForm.controls['org_id'].setValue(doc.id);
    console.log('hey manaf =>',doc);
    this.activeWizard2 = 1;
    this.organaization_id=doc.id

    this.adminService.fetchProducts().subscribe((doc:any)=>{this.products=doc;console.log("ghghg",doc);return doc});
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

}

export const ACTIVE: any = {
  'Active Users': 'false',
  'Inactive Users': 'true',
  'All Users': ''
}

