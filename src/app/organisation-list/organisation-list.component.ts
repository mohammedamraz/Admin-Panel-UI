import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  org_name: string="";
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

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private readonly adminService: AdminConsoleService,
    public service: AdvancedTableService,
    private sanitizer: DomSanitizer, 


  ) { }

  ngOnInit(): void {
    this.adminService.fetchAllActiveOrg().subscribe
    ((doc:any) =>{ this.tabDAta=doc;return doc});
    this.columns = this.tabDAta

    this.adminService.fetchProducts().subscribe((doc:any)=>{this.products=doc;return doc})
    this.adminService.fetchTpa(1).subscribe((doc: any) => {
      for (let i = 0; i <= doc.length - 1; i++) {
        if (doc[i].tpa_name != null) {
          this.codeList.push(doc[i].tpa_name)
        }

      }
   
        ; return doc;
    })

    this.basicWizardForm = this.fb.group({
      organization_name:[''],
      admin_name:['',Validators.required],
      organization_email:['',Validators.email],
      organization_mobile:['',[Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      fedo_score:[false],
      hsa:[false],
      ruw:[false],
      vitals:[false],
      designation:[''],
      url:[''],
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
        let data ={
            organization_name: this.basicWizardForm.value.organization_name,
            organization_email: this.basicWizardForm.value.organization_email,
            organization_mobile: '+91'+ this.basicWizardForm.value.organization_mobile

        };
        console.log("hgxfshdgdata",data);
        
    this.adminService.fetchOrgData(data).subscribe({
        next: (data:any)=>{
          
          
          
          this.activeWizard2 = this.activeWizard2+1;
        },
        error:(data:any)=>{
            console.log('the error =>',data);
     
                this.errorMessage=data;
                this.showLiveAlert=true;
            
        }
    })

    }
    else{
        this.activeWizard2 = this.activeWizard2+1;
    }
  }
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
    this.srcImage = './assets/images/fedo-logo-white.png';

  }
  onSelect(event: any) {
    console.log('don');
    
    this.files =[...event.addedFiles];
    this.srcImage = event.addedFiles;
    this.image= event.addedFiles[0];
    console.log('the file ', event.addedFiles[0])

  }
  getPreviewUrl(f: File) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(encodeURI(URL.createObjectURL(f)));
  }
  


  open(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { centered: true });
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
    data.append('web_url',this.listdetails.map(value=>'https://www.fedo.ai/products/vitals'+value.web_url).toString());
    data.append('type','orgAdmin');
    data.append('url','https://www.fedo.ai/admin/vital/'+this.basicWizardForm.value.url);
    console.log('this image => ,',this.image)
    this.image==''? null:data.append('file', this.image, this.image.name)
    console.log('the request body => ', data)
    this.adminService.createOrg(data).subscribe({
      next: (res:any) => {
        console.log('the success=>',res);
        this.org_name = res[0].organization_name;
        this.activeWizard2=this.activeWizard2+1;
      },
      error: (err) => {
        console.log('the failure=>',err);
        this.errorMessage=err;
        this.showLiveAlert=true;

      },
      complete: () => { }
    });
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
    let org_id = '1'
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
}
