import { Component, OnInit, TemplateRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AdminConsoleService } from '../services/admin-console.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-organisation-details',
  templateUrl: './organisation-details.component.html',
  styleUrls: ['./organisation-details.component.scss']
})
export class OrganisationDetailsComponent implements OnInit {

  files: File[] = [];
  tabDAta:any[]=[];
  OrgForm!: FormGroup;
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
  srcImage:any='./assets/images/fedo-logo-white.png';

  //details
  organization_name:any='';
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
  notThirdParty: boolean =true;
  showButton: boolean = true;
  selectedUserProducts:any[]=[];
  userProduct:any[]=[];
  codeList: any[] = [];
  organaization_id:any;
  products:any[]=[];
  next:boolean=false;
  created:boolean = false;
  showLiveAlertNextButton=false;

  errorMessageNextButton='';

  

  // thirdParty=false;
  tableData:any[]=[];



  constructor(
    private sanitizer: DomSanitizer, 
    private readonly adminService: AdminConsoleService,
    private modalService: NgbModal,
    private readonly route: ActivatedRoute,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {

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
        
        this.tabDAta=res
        console.log('the file', res);
        this.designation= res[0].designation;
        // this.listdetails = res[0].product;
        // this.list=this.list + res[0].product.length;

        this.organization_name= res[0].organization_name;
        this.admin_name= res[0].admin_name;
        this.application_id= res[0].application_id;
        this.attempts= res[0].attempts;
        this.created_date= res[0].created_date;
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
        console.log('the days left', days_difference)
        this.daysLeft = days_difference;
        this.srcImage=res[0].logo === ''||!res[0].logo ? "./assets/images/fedo-logo-white.png": res[0].logo ;
        this.createEditproc(this.products,this.product);
        this.adminService.fetchLatestUserOfOrg(this.snapshotParam).subscribe(
          (doc:any) => {this.tableData=doc;console.log("ghf",doc);
          }
        )
        },
      error:(err)=>{
        console.log('the error', err);
      }
    })





    // this.adminService.fetchLatestOrg().subscribe
    // ((doc:any) =>{ this.tabDAta=doc;return doc})

    this.adminService.fetchLatestUserOfOrg(this.snapshotParam).subscribe(
      (doc:any) => {this.tableData=doc;}
    )

    this.OrgForm = this.fb.group({
      organization_name:[this.organization_name],
      admin_name:[this.admin_name],
      organization_email:[this.organization_email,Validators.email],
      organization_mobile:[this.organization_mobile,[Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      designation:[this.designation],
      fedo_score:[this.fedo_score],
      url:[this.url],
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
    // this.adminService.fetchTpa(1).subscribe((doc: any) => {
    //   for (let i = 0; i <= doc.length - 1; i++) {
    //     if (doc[i].tpa_name != null) {
    //       this.codeList.push(doc[i].tpa_name)
    //     }

    //   }
   
    //     ; return doc;
    // })

  }

  createEditproc(products:any,OrgProducts:any){

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
      pilot_duration: el.pilot_duration,
      product_name: el.product_id === '1' ? 'HSA' : (el.product_id === '2' ? 'Vitals':'RUW' ),
      web_access: el.web_access,
      web_url: el.web_url,
      web_fedoscore:el.web_fedoscore,
      product_junction_id: el.id,
      product_id: el.product_id
    }})
    this.list=this.list+list.length
    console.log('asdfq',list)
    this.products = product
    this.listdetails = list
  }

  
  

  daysLefts(date:any){
    const firstDate = new Date();
    const secondDate = new Date(date);
    const total_seconds = Math.abs(secondDate.valueOf() - firstDate.valueOf()) / 1000;  
    const days_difference = Math.floor (total_seconds / (60 * 60 * 24)); 
    return days_difference;
  }
  

  prepopulateOrgFormforEdit(){
    this.OrgForm.controls['organization_name'].setValue(this.organization_name);
    this.OrgForm.controls['admin_name'].setValue(this.admin_name);
    this.OrgForm.controls['organization_email'].setValue(this.organization_email);
    this.OrgForm.controls['organization_mobile'].setValue(this.organization_mobile.slice(3,));
    this.OrgForm.controls['fedo_score'].setValue(this.fedo_score);
    this.OrgForm.controls['designation'].setValue(this.designation);
    this.OrgForm.controls['url'].setValue(this.url);
    this.activeWizard2 = 1;

 }

  orgEdit(content: TemplateRef<NgbModal>){
    this.modalService.open(content, { centered: true });

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
        this.srcImage = './assets/images/fedo-logo-white.png';

      },
      error: (err) => {
        console.log('the failure=>',err);
      },
      complete: () => { }
    });
  }
  onSelect(event: any) {

    this.files =[...event.addedFiles];
    console.log('the iage',event.addedFiles);
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
    this.modalService.open(content, { centered: true });
  }
  demoFunction(event:any, product:string){
    if(product==='hsa'){
      this.OrgForm.controls['ruw'].setValue(false);
      this.OrgForm.controls['vitals'].setValue(false);
      const selected =this.listdetails.findIndex(obj=>obj.name===product);
      this.listdetails.splice(selected,1);
    }
    if(product==='ruw'){
      this.OrgForm.controls['hsa'].setValue(false);
      this.OrgForm.controls['vitals'].setValue(false);
      const selected =this.listdetails.findIndex(obj=>obj.name===product);
      this.listdetails.splice(selected,1);
    }
    if(product==='vitals'){
      this.OrgForm.controls['hsa'].setValue(false);
      this.OrgForm.controls['ruw'].setValue(false);
      const selected =this.listdetails.findIndex(obj=>obj.name===product);
      this.listdetails.splice(selected,1);
    }
    if(event.target.checked){
      this.list=4;
      let details={name:product, index:this.list-1}
      this.listdetails.push(details)
    }
    else{
      this.list--;
      const selected =this.listdetails.findIndex(obj=>obj.name===product);
      this.listdetails.splice(selected,1);
    }
  }
  updateProduct(event:any, productId:string){
    console.log('the products',this.products)
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
  demoPrgFunction(event:any, product:string){
    if(product==='hsa'){
      this.OrgForm.controls['ruw'].setValue(false);
      this.OrgForm.controls['vitals'].setValue(false);
      const selected =this.listdetails.findIndex(obj=>obj.name===product);
      this.listdetails.splice(selected,1);
    }
    if(product==='ruw'){
      this.OrgForm.controls['hsa'].setValue(false);
      this.OrgForm.controls['vitals'].setValue(false);
      const selected =this.listdetails.findIndex(obj=>obj.name===product);
      this.listdetails.splice(selected,1);
    }
    if(product==='vitals'){
      this.OrgForm.controls['hsa'].setValue(false);
      this.OrgForm.controls['ruw'].setValue(false);
      const selected =this.listdetails.findIndex(obj=>obj.name===product);
      this.listdetails.splice(selected,1);
    }
    if(event.target.checked){
      this.listorg=4;
      let details={name:product, index:this.list-1}
      this.listdetails.push(details)
    }
    else{
      this.listorg--;
      const selected =this.listdetails.findIndex(obj=>obj.name===product);
      this.listdetails.splice(selected,1);
    }
  }

  checkingForm(){
    this.basicWizardForm.removeControl('ruw');
    this.basicWizardForm.removeControl('hsa');
    this.basicWizardForm.removeControl('vitals');
    // this.basicWizardForm.controls['product_name'].setValue(this.product);
    this.basicWizardForm.controls['organization_name'].setValue(this.organization_name);
    console.log('the patch detaisl',this.basicWizardForm)
    this.adminService.createUser(this.basicWizardForm.value).subscribe({
      next: (res:any) => {
        console.log('the success=>',res.user_name);
        this.user_name=res[0].user_name

        this.activeWizard1=this.activeWizard1+1;
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
    this.adminService.addTpa({ tpa_name: input, org_id: org_id }).subscribe((doc: any) => {
      // console.log("jhfgdjgj", typeof (input));

      // console.log("", doc);
      ; return doc;
    })
  }

  setValue(doc: any){
    this.userForm.reset();
    this.thirdParty = false;
    this.errorMessage = '';
    this.showLiveAlert = false;
    this.userForm.controls['org_id'].setValue(doc.id);
    console.log('hey manaf =>',doc);
    this.activeWizard1 = 1;
    this.organaization_id=doc.id

    this.userProduct = doc.product.map((val: any) =>({product_name: val.product_id === '1' ? 'HSA' : (val.product_id === '2' ? 'Vitals':'RUW' ), product_id: val.product_id}))
    console.log('see manaf', this.userProduct)

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
        console.log("insode")
        this.user_name = res.user_name
        console.log('the success=>', res);
        this.activeWizard1 = this.activeWizard1 + 1;
        this.created = true;
      },
      error: (err) => {
        console.log('the failure=>', err);
        this.errorMessage = err;
        this.showLiveAlert = true;

      },
      complete: () => { }
    });
  }


  checkingOrgForm(){

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
        web_access: el.web_access,
        web_url: el.web_access ? el.web_url :'',
        web_fedoscore: el.web_access ? el.web_fedoscore:false
      }
    });
    console.log('dalsdfj',this.listdetails)
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

    this.adminService.patchOrgDetails(this.id, data).subscribe({
      next: (res) => {
        console.log('the success=>',res);
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
  }
    

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
clearform(){
    this.srcImage='./assets/images/fedo-logo-white.png';
    this.basicWizardForm.reset();
    this.listdetails=[];
    this.list=4;
    this.activeWizard1 =1;
   }

   checkUserFirstForm(){

    if(this.userForm.controls['user_name'].valid && this.userForm.controls['designation'].valid && this.userForm.controls['email'].valid && this.userForm.controls['mobile'].valid){

      let data ={

        // organization_name: this.userForm.controls['user_name'],

        email: this.userForm.value['email'],

        mobile: '+91'+ this.userForm.value['mobile']



    };

      this.adminService.fetchUserDataIfExists(data).subscribe({

        next: (data:any)=>{    

          this.activeWizard1=this.activeWizard1+1;

        },

        error: (err) => {

          console.log('the failure=>',err);

          this.errorMessageNextButton=err;

          this.showLiveAlertNextButton=true;

        },

     

    })

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


}
