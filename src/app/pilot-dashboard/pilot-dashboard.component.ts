import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminConsoleService } from '../services/admin-console.service';

@Component({
  selector: 'app-pilot-dashboard',
  templateUrl: './pilot-dashboard.component.html',
  styleUrls: ['./pilot-dashboard.component.scss']
})
export class PilotDashboardComponent implements OnInit {

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



  constructor(
    private readonly route: ActivatedRoute,
    private readonly adminService: AdminConsoleService,
    private modalService: NgbModal,
    private fb: FormBuilder,

  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((val:any) =>{
      this.orgId = val.orgId;
      this.productId = val.Id;
      this.adminService.fetchOrgById(this.orgId).subscribe({
        next:(res:any) =>{
          const selected =res[0].product.findIndex((obj:any)=>obj.product_id===this.productId);
          this.product= res[0].product[selected];
          console.log('asdw',this.product.status);
          this.userProduct = [{product_id:this.product.product_id,product_name:this.product.product_id === '1' ? 'HSA' : (this.product.product_id === '2' ? 'Vitals':'RUW' )}]
          if(this.product.status == "Expired"){
            this.show = true;
          }
        }});
      this.adminService.fetchLatestUserOfOrgProd(this.orgId,this.productId).subscribe(
        (doc:any) => {this.tableData=doc.data;console.log('doc',doc)});
        this.userForm =this.fb.group({
          user_name: ['',Validators.required],
          designation: ['',Validators.required],
          email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
          mobile: ['',[Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
          org_id: [this.orgId],
          product_id: [''],
          third_party_org_name: ['',Validators.required],
  
        });
    })
    // this.orgId = this.route.snapshot.paramMap.get("orgId");
    // this.productId = this.route.snapshot.paramMap.get("Id");
    // console.log('tjhs',this.productId)



    

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
    // else {let redirectWindow = window.open("https://www.google.com");}   
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
        this.errorMessage = err;
        this.showLiveAlert = true;

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
          console.log('the failure=>',err);
          this.errorMessageNextButton=err;
          this.showLiveAlertNextButton=true;
        },
    })
  }
  }

  }
}
  

