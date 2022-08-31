import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  activeWizard1: number = 1;
  userWizard1:number =1;
  showLiveAlert=false;
  list: number = 3;
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

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private readonly adminService: AdminConsoleService,
    public service: AdvancedTableService,


  ) { }

  ngOnInit(): void {
    this.adminService.fetchAllOrg().subscribe
    ((doc:any) =>{ this.tabDAta=doc;return doc});
    this.columns = this.tabDAta
  
    this.userForm = this.fb.group({
      organization_name:[''],
      admin_name:[''],
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
    this.userForm = this.fb.group({
      user_name: [''],
      designation: [''],
      email: ['', Validators.email],
      mobile: [''],
      organization_name: [''],
      product_name: [''],
      third_party_org_name: [''],
      hsa: [''],
      ruw: [''],
      vitals: ['']
    })
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
    console.log('the form values => ',this.userForm.value)

    this.userForm.removeControl('ruw');
    this.userForm.removeControl('hsa');
    this.userForm.removeControl('vitals');
    this.userForm.controls['product_name'].setValue(this.product);
    this.adminService.createUser(this.userForm.value).subscribe({
      next: (res) => {
        console.log('the success=>',res);
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

  checkingUserForm(){
    console.log('the form values => ',this.userForm.value)

    this.userForm.removeControl('ruw');
    this.userForm.removeControl('hsa');
    this.userForm.removeControl('vitals');
    this.userForm.value.third_party_org_name.length === '' ? this.userForm.removeControl('third_party_org_name'):null
    this.userForm.controls['product_name'].setValue(this.product);
    this.userForm.controls['organization_name'].setValue(this.userOrganisationName);
    this.adminService.createUser(this.userForm.value).subscribe({
      next: (res) => {
        console.log('the success=>',res);
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

  demoFunction(event:any, product:string){
    console.log('asdf',event.target.checked);
    if(product==='hsa'){
      this.userForm.controls['ruw'].setValue(false);
      this.userForm.controls['vitals'].setValue(false);
      const selected =this.listdetails.findIndex(obj=>obj.name===product);
      this.listdetails.splice(selected,1);
    }
    if(product==='ruw'){
      this.userForm.controls['hsa'].setValue(false);
      this.userForm.controls['vitals'].setValue(false);
      const selected =this.listdetails.findIndex(obj=>obj.name===product);
      this.listdetails.splice(selected,1);
    }
    if(product==='vitals'){
      this.userForm.controls['hsa'].setValue(false);
      this.userForm.controls['ruw'].setValue(false);
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

  demoUserFunction(event:any, product:string){
    console.log('asdf',event.target.checked);
    if(product==='hsa'){
      this.product = product;
      this.userForm.controls['ruw'].setValue(false);
      this.userForm.controls['vitals'].setValue(false);
      const selected =this.listdetails.findIndex(obj=>obj.name===product);
      this.listdetails.splice(selected,1);
    }
    if(product==='ruw'){
      this.product = product;
      this.userForm.controls['hsa'].setValue(false);
      this.userForm.controls['vitals'].setValue(false);
      const selected =this.listdetails.findIndex(obj=>obj.name===product);
      this.listdetails.splice(selected,1);
    }
    if(product==='vitals'){
      this.product = product;
      this.userForm.controls['hsa'].setValue(false);
      this.userForm.controls['ruw'].setValue(false);
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
}
