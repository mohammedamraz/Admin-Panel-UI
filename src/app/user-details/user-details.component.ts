import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminConsoleService } from '../services/admin-console.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  

  constructor(
    private readonly route: ActivatedRoute,
    private readonly adminService: AdminConsoleService,
    private modalService: NgbModal,


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

  

  ngOnInit(): void {
    this.snapshotParam = this.route.snapshot.paramMap.get("orgId");

    this.adminService.fetchAllUserOfOrg(this.snapshotParam).subscribe({
     next:(res:any)=>{this.userList=res;
      this.userList = res.sort((a: { id: number; },b: { id: number; })=> b.id-a.id)
    }
    })

    this.adminService.fetchOrgById(this.snapshotParam).subscribe({
      next:(res:any) =>{
        this.userOrganisationName= res[0].organization_name;
      }})

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
      },
      error: (err) => {
        console.log('the failure=>',err);
        this.errorMessage=err;
        this.showLiveAlert=true;
      },
      complete: () => { }
    });
  } 

  open(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { centered: true });
  }

}
