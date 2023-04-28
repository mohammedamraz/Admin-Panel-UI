import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminConsoleService } from '../services/admin-console.service';
import { AdvancedTableService } from '../shared/advanced-table/advanced-table.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  page=1
  activeWizard2: number = 1;
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
    private _route: ActivatedRoute,
    private router: Router,

  ) { }

  snapshotParam: any = "initial value";
  prod: any = '';
  userList: any[] = [];
  userEditForm!: FormGroup;
  userForm!: FormGroup;
  list: number = 3;
  thirdParty=false;
  product: any[] = []
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
  @ViewChild('toggleModal6', { static: true }) input3!: ElementRef;
  userId: any;
  errorMessageNextButton='';
  length:any
  pageSizeOptions: number[] = [10, 20,30,40,50,60,70,80,90,100];
  entries:any=this.pageSizeOptions[0]
  pagenumber:any=1;
  total_pages:any;
  total_user:any;
  errorMessageResendInvitation = ' '
  showLiveAlertResendInvitation =false 
  productsData : any
  show=false
  currentPage:any;
  showLiveAlertAPI=false;
  errorMessageAPI='';
  activeStatusOptions:any= ['All Users', 'Active Users','Inactive Users'];                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
  activeStatusValue: any= this.activeStatusOptions[1]
  changeButton:boolean=false
  userProductEdited:any=[];
  orglogin : boolean = false;
  userlogin : boolean = false;
  list_number : number = 3;



  ngOnInit(): void {

    let data:any =  JSON.parse(sessionStorage.getItem('currentUser')!);
    if(data.hasOwnProperty('orglogin')){
      // if(data.orglogin){
        this.orglogin=true;
      // }
      // else{
      //   this.orglogin=true;
      //   this.userlogin=false;
      // }
    }
    this.route.params.subscribe((val:any) =>{   
      this.prod = val.prodId;
      this.snapshotParam = val.orgId;
      const temp = this.prod === null ? 'vitals': (this.prod === '1' ? 'hsa' : (this.prod === '2' ? 'vitals': 'ruw') )
      this.adminService.fetchOrganisationCount().subscribe((doc:any)=>{this.organisationCount=doc['total_organizations_count']})
      this.adminService.fetchVitalsCount(temp).subscribe((doc:any) =>{this.vitalsCount=doc['total_vitals_pilot_count']})
      this.adminService.fetchLatestOrg().subscribe((doc:any) =>{ this.tabDAta=doc;return doc});

      this._route.queryParams.subscribe((params:any) => {
        JSON.stringify(params) === '{}' ? null : [this.pagenumber= params.page, this.entries = params.entry , this.activeStatusValue = params.status]
        if(this.prod == undefined) {


          this.adminService.fetchAllUserOfOrgByPage(this.snapshotParam,this.pagenumber,this.entries,ACTIVE[this.activeStatusValue]).subscribe
          ((doc:any) =>{ 
              this.page = this.pagenumber
              this.total_user = doc.total
              this.currentPage = doc.page
              this.total_pages = doc.total_pages
              this.userList = doc.data;
              this.userList.map((doc: any) => {
                var newArray = doc.tests
                var result = newArray.find((item: any) => item.product_id === 2);
                const v = Object.assign(doc, {vitalsTest:result.total_tests})
              })
              this.length = this.userList.length
              this.userList = doc.sort((a: { id: number; }, b: { id: number; }) => b.id - a.id);

              this.userList=doc.data;
              this.length=this.userList.length
              this.userList = doc.sort((a: { id: number; },b: { id: number; })=> b.id-a.id);
        
              return doc});
        }
        else {
          this.adminService.fetchUserOfOrgProd(this.snapshotParam,this.prod,this.entries,this.pagenumber,ACTIVE[this.activeStatusValue]).subscribe
          ((doc:any) =>{ 
              this.page = this.pagenumber
              this.total_user = doc.total
              this.currentPage = doc.page
              this.total_pages = doc.total_pages
              this.userList = doc.data;
              this.userList.map((doc: any) => {
                var newArray = doc.tests
                var result = newArray.find((item: any) => item.product_id === 2);
                const v = Object.assign(doc, {vitalsTest:result.total_tests})
              })
              this.length = this.userList.length

            return doc});
        }
      })

      this.adminService.fetchOrgById(this.snapshotParam).subscribe({
      next:(res:any) =>{
        this.tableData=res        
        this.userOrganisationName= res[0].organization_name;
        const selected =res[0].product.findIndex((obj:any)=>obj.product_id===this.prod);
        this.productsData= res[0].product[selected];
        this.product= res[0].product;
          this.show = false;
        if(this.orglogin == true && res[0].type!='admin'&&this.productsData.status == "Expired"){
            this.show = true;
          }
      }})

      this.list=4;

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
        email: ['', [Validators.required, Validators.pattern("^\\s{0,}?[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,7}\\s{0,}?$")]],
        mobile: ['',[Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
        org_id: [''],
        is_web : [false],
        product_id: [''],
        role : [''],
        third_party_org_name: ['',Validators.required],
        hsa:[false],
        ruw:[false],
        vitals:[false],

      });


    });

  }
  sendEmail(){

    let data={ organisation_admin_name:this.tableData[0].admin_name,organisation_admin_email:this.tableData[0].organization_email,
      organisation_admin_mobile:this.tableData[0].organization_mobile,designation:this.tableData[0].designation,organisation_name:this.tableData[0].organization_name,expired_date:this.tableData[0].product[0].end_date.slice(0,10)}
    this.adminService.sendEmailNotification(data).subscribe({
      next: (res:any) => {
        console.debug(res)
       }   ,
       error : (err:any)=>{
        console.debug(err)
       }
      
    });

  }

  loadPage(val:any){
    this.pagenumber=val
    this.router.navigate([], {
      queryParams: {
        page: this.pagenumber,
        status : this.activeStatusValue,
        entry : this.entries
      },
    });

    if(this.prod == undefined) {
      this.adminService.fetchAllUserOfOrgByPage(this.snapshotParam,this.pagenumber,this.entries,ACTIVE[this.activeStatusValue]).subscribe
    ((doc:any) =>{ 
      this.total_pages=doc.total_pages
      this.currentPage=doc.page
      this.total_user=doc.total
      this.userList=doc.data;
      this.length=this.userList.length
      this.userList.map((doc: any) => {
        var newArray = doc.tests
        var result = newArray.find((item: any) => item.product_id === 2);
        const v = Object.assign(doc, {vitalsTest:result.total_tests})
      })
      this.userList = doc.sort((a: { id: number; },b: { id: number; })=> b.id-a.id);

          return doc
    });}
      else{
        this.adminService.fetchUserOfOrgProd(this.snapshotParam,this.prod,this.entries,this.pagenumber,ACTIVE[this.activeStatusValue]).subscribe
        ((doc:any) =>{ 
          this.total_pages=doc.total_pages
          this.currentPage=doc.page
          this.total_user=doc.total

          this.userList=doc.data;
          this.userList.map((doc: any) => {
            var newArray = doc.tests
            var result = newArray.find((item: any) => item.product_id === 2);
            const v = Object.assign(doc, {vitalsTest:result.total_tests})
          })
          this.length=this.userList.length

          return doc


      })}   

  }

  updateStatus(data:any,userData:any){

    if(this.activeStatusValue == 'Active Users'){
      this.userList = this.userList.filter(obj => obj.id != userData.id);      
    }
    else if(this.activeStatusValue == 'Inactive Users'){
      this.userList = this.userList.filter(obj => obj.id != userData.id);
    }
    else if(this.activeStatusValue == 'All Users'){
      const selected = this.userList.findIndex(obj => obj.id === userData.id);
      this.userList[selected].is_deleted = !data;
    }

    this.adminService.patchUserStatus(userData.id, data).subscribe({
      next: (res) => {
        if(data) this.adminService.sendEmailOnceUserIsBackActive({name:userData.user_name,email:userData.email}).subscribe({
          next: (res) =>{
            // this.reloadCurrentPage();
          },
          error : (err)=>{
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

      },
      error : (err)=>{

      }
    })

  }

  onFilter (data:any) {
      this.entries=data.value
    this.router.navigate([], {
      queryParams: {
        page: this.pagenumber,
          status : this.activeStatusValue,
          entry : this.entries
      },
    });

      if(this.prod == undefined) {
        this.adminService.fetchAllUserOfOrgByPage(this.snapshotParam,this.pagenumber,this.entries,ACTIVE[this.activeStatusValue]).subscribe
      ((doc:any) =>{ 
        this.total_pages=doc.total_pages
        this.currentPage=doc.page
        this.total_user=doc.total
        this.userList=doc.data;
        this.length=this.userList.length
        this.userList.map((doc: any) => {
          var newArray = doc.tests
          var result = newArray.find((item: any) => item.product_id === 2);
          const v = Object.assign(doc, {vitalsTest:result.total_tests})
        })
        this.userList = doc.sort((a: { id: number; },b: { id: number; })=> b.id-a.id);

          return doc
      });}
        else{
          this.adminService.fetchUserOfOrgProd(this.snapshotParam,this.prod,this.entries,this.pagenumber,ACTIVE[this.activeStatusValue]).subscribe
          ((doc:any) =>{ 
            this.total_pages=doc.total_pages
            this.currentPage=doc.page
            this.total_user=doc.total

            this.userList=doc.data;
            this.userList.map((doc: any) => {
              var newArray = doc.tests
              var result = newArray.find((item: any) => item.product_id === 2);
              const v = Object.assign(doc, {vitalsTest:result.total_tests})
            })
            this.length=this.userList.length

          return doc


        })}


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


      if(this.prod == undefined) {
      this.adminService.fetchAllUserOfOrgByPage(this.snapshotParam,this.pagenumber,this.entries,ACTIVE[this.activeStatusValue]).subscribe
    ((doc:any) =>{ 

      this.total_pages=doc.total_pages
      this.currentPage=doc.page
      this.total_user=doc.total
      this.userList=doc.data; 
      this.userList.map((doc: any) => {
        var newArray = doc.tests
        var result = newArray.find((item: any) => item.product_id === 2);
        const v = Object.assign(doc, {vitalsTest:result.total_tests})
      })
      this.length=this.userList.length

          return doc
    },(error)=>{
      this.userList=[];
    });}
      else{
        this.adminService.fetchUserOfOrgProd(this.snapshotParam,this.prod,this.entries,this.pagenumber,ACTIVE[this.activeStatusValue]).subscribe
        ((doc:any) =>{ 

          this.total_pages=doc.total_pages
          this.currentPage=doc.page
          this.total_user=doc.total
          this.userList=doc.data;
          this.userList.map((doc: any) => {
            var newArray = doc.tests
            var result = newArray.find((item: any) => item.product_id === 2);
            const v = Object.assign(doc, {vitalsTest:result.total_tests})
          })
          this.length=this.userList.length

          return doc

      })}

  }

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
    this.image==''? null:data.append('file', this.image, this.image.name)
    this.adminService.createOrg(data).subscribe({
      next: (res:any) => {
        this.activeWizard2=this.activeWizard2+1;
        this.org_name = res.organization_name;
      },
      error: (err) => {
        this.errorMessage=err;
        this.showLiveAlert=true;

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
      const selected =this.listdetails.findIndex(obj=>obj.name===product.product_name);
      this.selectedProducts.slice(product.id,1);
      this.listdetails.splice(selected,1);
    }
  }

  paginate(): void {
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
    this.userForm.value.role == ''
    this.userForm.controls['product_id'].setValue(this.selectedUserProducts.map(value => value.product_id).toString());
    if(this.notThirdParty == true){
      this.userForm.value.third_party_org_name == null
    }
    else if (this.thirdParty == true){
      Object.assign(this.userForm.value, { tpa_name: this.userForm.value.third_party_org_name } );
      this.userForm.value.third_party_org_name == null
    }
    if(this.userForm.value.is_web == undefined || this.userForm.value.is_web == false){
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
  else {
    Object.assign(this.userForm.value, { password: "Test@123" } );
    this.adminService.createUserDirect(this.userForm.value).subscribe({
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
          email: this.userForm.value['email'],
        mobile: '+91'+ this.userForm.value['mobile']
        };

        this.adminService.fetchUserDataIfExists(data).subscribe({

        next: (data:any)=>{    

          this.activeWizard2=this.activeWizard2+1;
          this.showLiveAlertNextButton=false;
          this.showLiveAlertAPI = false
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
  change(val:any) {
    if(val==true){
      this.thirdParty=true;
      this.notThirdParty=false;
    }
    else if(val==false){
      this.notThirdParty=true;
      this.thirdParty=false
    }


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
  editInputTpa() {
    this.userEditForm.get('third_party_org_name')?.value
    if (this.codeList.includes(this.userEditForm.get('third_party_org_name')?.value)) {
      this.showButton = false;
    }
    else {
      this.showButton = true;
      this.changeButton=true

    }
    this.userEditForm.get("third_party_org_name")?.valueChanges.subscribe(x => {
        this.changeButton=true
        this.addTpafunc=false
      })

  }
  editAddTpa() {
    this.addTpafunc=true;
    this.changeButton=false

    let input = this.userEditForm.get('third_party_org_name')?.value
    let org_id = this.organaization_id
    this.adminService.addTpa({ tpa_name: input, org_id: org_id }).subscribe((doc: any) => {  console.log("what is response",doc) ; return doc;
      
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
    this.activeWizard2 = 1;
    this.organaization_id=doc.id

    this.adminService.fetchProducts().subscribe((doc:any)=>{this.products=doc;return doc});
    this.adminService.fetchTpa(this.organaization_id).subscribe((doc: any) => {
      for (let i = 0; i <= doc.length - 1; i++) {
        if (doc[i].tpa_name != null) {
          this.codeList.push(doc[i].tpa_name)
        }

      }
      ; return doc;
    })

    this.userProduct = doc.product.map((val: any) =>({product_name: val.product_id === '1' ? 'hsa' : (val.product_id === '2' ? 'vitals':'ruw' ), product_id: val.product_id}))
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

    updateEditUserProd(event:any, product:any){
      const selected = this.userProduct.findIndex(obj=>obj.product_id===product.product_id)
      if(event.target.checked){
      this.userProduct[selected].checked = true;
      this.userProductEdited.push(this.userProduct[selected]);
      }else{
      this.userProduct[selected].checked = false;
        const index = this.userProductEdited.findIndex((obj:any)=>obj.product_id===product.product_id)
        this.userProductEdited.splice(index,1);
    }
  }

    editUserForm(data:any){
    console.log('the persons data =>',data)
    this.organaization_id=data.org_id
    this.userEditForm = this.fb.group({
      email:[data.email,[Validators.email]],
      mobile:[parseInt(data.mobile.slice(3,)),[Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]  ],
      user_name:[data.user_name,[Validators.required]],
      designation:[data.designation,[Validators.required]],
      third_party_org_name:[data.tpa_name, Validators.required]
    })
    this.userId = data.id
    this.adminService.fetchTpa(this.organaization_id).subscribe((doc: any) => {
      for (let i = 0; i <= doc.length - 1; i++) {
        if (doc[i].tpa_name != null) {
          this.codeList.push(doc[i].tpa_name)
        }

      }
      ; return doc;
    })
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
      doc['attempts'] = 0

      let list = data.tests.filter((obj:any) => obj.is_pilot_duration == false );
      list = list.map((el:any) => {
        return {
        product_name: el.product_id === 1 ? 'HSA' : (el.product_id === 2 ? 'Vitals':'RUW' ),
        product_junction_id: el.id,
        product_id: el.product_id,
        attempts:el.attempts,
      }
        
  
    })

    this.list_number=3+list.length
    this.listdetails = list;
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
      this.listdetails.map((list:any)=>{
        const selected_data = this.userProductEdited.findIndex((el:any)=>el.product_id.toString()==list.product_id.toString())
this.userProductEdited[selected_data]['attempts']= selected_data === -1 ? 0 : list.attempts;
})
      data['product_id']=this.userProductEdited.map((value:any)=> value.product_id).toString();
      data['product_junction_id'] = this.userProductEdited.map((value:any)=> value.junctionId).toString();
      data['product_junction_id'] = this.userProductEdited.filter(((value:any)=> value.junctionId == '' ? false : true)).map((value:any) => value.junctionId).toString();
      data['attempts'] = this.userProductEdited.map((value:any) => value.attempts).toString();
    if(this.notThirdParty == true){
      data['third_party_org_name'] = null;
    }
    else if (this.thirdParty == true){
      data['tpa_name'] = data['third_party_org_name']
      data['third_party_org_name'] = null;
    }

    console.log('list => ',this.userProduct)
    console.log('full form => ',data)
    this.adminService.patchuser(this.userId,data).subscribe({
      next: (res:any) => {
        this.activeWizard2=this.activeWizard2+1;

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

export const ACTIVE: any = {
  'Active Users': 'false',
  'Inactive Users': 'true',
  'All Users': ''
}

