import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../core/service/auth.service';
import { AdminConsoleService } from '../services/admin-console.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  loggedInUser: any={};
  organization_name:any='';
  snapshotParam:any = "initial value";
  OrgForm!: FormGroup;
  admin_name:any='';
  organization_email:any='';
  organization_mobile:any='';
  designation:any='';
  fedo_score:boolean= true;
  url:any='';
  activeWizard2: number = 1;
  created:boolean = false;
  list: number = 2;
  OrgDetailsEditForm = false;
  showOrgLiveAlert=false;
  errorOrgMessage = '';
  id:any='';
  products:any[]=[];
  product:any[]=[];
  listdetails:any[]=[];
  srcImage:any='./assets/images/person.jpg';
  files: File[] = [];


  constructor(
    private readonly route: ActivatedRoute,
    private readonly adminService: AdminConsoleService,
    private sanitizer: DomSanitizer, 
  ) { }

  ngOnInit(): void {

    
    let data:any =  JSON.parse(sessionStorage.getItem('currentUser')!);
    if(data.user_data){
      this.admin_name = data.user_data[0].user_name;
        this.organization_email = data.user_data[0].email;
        this.organization_mobile = data.user_data[0].mobile;
        this.designation = data.user_data[0].designation;
    }
    else  {
      this.admin_name = data.org_data[0].admin_name;
        this.organization_email = data.org_data[0].organization_email;
        this.organization_mobile = data.org_data[0].organization_mobile;
        this.designation = data.org_data[0].designation;
    }
    this.adminService.fetchProducts().subscribe((doc:any)=>{this.products=doc;return doc});
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

checkingOrgForm(){

  this.OrgDetailsEditForm = true
  if(this.OrgForm.controls['organization_mobile'].valid && this.OrgForm.controls['organization_name'].valid &&this.OrgForm.controls['admin_name'].valid && this.OrgForm.controls['designation'].valid ){

  this.adminService.patchOrg(this.id, this.OrgForm.value).subscribe({
    next: (res) => {
      this.activeWizard2=this.activeWizard2+1;
      this.created=true;
    },
    error: (err) => {
      this.errorOrgMessage=err;
      this.showOrgLiveAlert=true;
    },
    complete: () => { }
  });
}
}



onSelect(event: any) {
}

getPreviewUrl(f: File) {
return this.sanitizer.bypassSecurityTrustResourceUrl(encodeURI(URL.createObjectURL(f)));
}

onRemove(event: any) {
this.files.splice(this.files.indexOf(event), 1);
this.adminService.deleteImageLogoFromOrgDb(this.id).subscribe({
  next: (res) => {
    this.srcImage = '';

  },
  error: (err) => {},
  complete: () => { }
});
}


}

