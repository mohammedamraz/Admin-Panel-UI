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
    private authenticationService: AuthenticationService,
    private readonly adminService: AdminConsoleService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer, 
  ) { }

  ngOnInit(): void {

    
    let data:any =  JSON.parse(sessionStorage.getItem('currentUser')!);
    console.log('userdata',data.user_data);
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
    
    // console.log("current user",data.org_data[1].org_id);
    

    // this.loggedInUser = <any>this.authenticationService.currentUser();
    // this.snapshotParam = this.route.snapshot.paramMap.get("orgId");
    // console.log("yughfhdgfdgdgfdgfdg",this.snapshotParam);
    

    this.adminService.fetchProducts().subscribe((doc:any)=>{this.products=doc;return doc});


    // this.adminService.fetchOrgById(1).subscribe({
    //   next:(res:any) =>{
        
    //     this.organization_name= res[0].organization_name;
    //     this.admin_name = res[0].admin_name;
    //     this.organization_email = res[0].organization_email;
    //     this.organization_mobile = res[0].organization_mobile;
    //     this.designation = res[0].designation;
    //     this.fedo_score = res[0].fedo_score;
    //     this.url = res[0].url;
    //     this.id= res[0].id;
    //     this.product= res[0].product;
    //     // this.srcImage=res[0].logo === ''||!res[0].logo ? "https://fedo-vitals.s3.ap-south-1.amazonaws.com/MicrosoftTeams-image%20%282%29.png": res[0].logo ;





    //   }});
    // this.OrgForm = this.fb.group({
    //     organization_name:[this.organization_name,[Validators.required]],
    //     admin_name:[this.admin_name],
    //     organization_email:[this.organization_email,Validators.email],
    //     organization_mobile:[this.organization_mobile,[Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
    //     designation:[this.designation,[Validators.required]],
    //     fedo_score:[this.fedo_score],
    //     url:[this.url],
    //   });

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
}

// orgEdit(content: TemplateRef<NgbModal>): void {
// this.createEditproc(this.products,this.product);
// this.modalService.open(content, { centered: true,keyboard : false, backdrop : 'static' ,size:'lg' });
// }

// createEditproc(products:any,OrgProducts:any){

// const product = products.map((doc:any)=>{
//    const found = OrgProducts.some((el:any)=>el.product_id === doc.id.toString());
//    if(found){
//      doc['checked'] = true;
//      doc['noPenetration']=true;
//    }
//    else{
//      doc['checked'] = false;
//      doc['noPenetration']=false;

//    }
//    return doc
//  })

//  const list = OrgProducts.map((el:any) => {return {
//    fedoscore: el.fedoscore,
//    pilot_duration: el.pilot_duration,
//    product_name: el.product_id === '1' ? 'HSA' : (el.product_id === '2' ? 'Vitals':'RUW' ),
//    web_access: el.web_access,
//    web_url: el.web_url,
//    web_fedoscore:el.web_fedoscore,
//    product_junction_id: el.id,
//    product_id: el.product_id,
//    event_mode:el.event_mode
//  }})
//  this.list=this.list+list.length
//  console.log('asdfq',list)
//  this.products = product;
//  this.listdetails = list;
// }

// prepopulateOrgFormforEdit(){
// this.OrgForm.controls['organization_name'].setValue(this.organization_name);
// this.OrgForm.controls['admin_name'].setValue(this.admin_name);
// this.OrgForm.controls['organization_email'].setValue(this.organization_email);
// this.OrgForm.controls['organization_mobile'].setValue(this.organization_mobile.slice(3,));
// this.OrgForm.controls['fedo_score'].setValue(this.fedo_score);
// this.OrgForm.controls['designation'].setValue(this.designation);
// this.OrgForm.controls['url'].setValue(this.url);
// this.activeWizard2 = 1;

// }

onSelect(event: any) {

// this.files =[...event.addedFiles];
// console.log('the iage',event.addedFiles);
// this.srcImage = this.getPreviewUrl(event.addedFiles[0]);

// var data = new FormData();
// data.append('file', event.addedFiles[0], event.addedFiles[0].name)
// this.adminService.updateImageLogoInOrgDb(this.id,data).subscribe({
//   next: (res) => {
//     console.log('the success=>',res);
//   },
//   error: (err) => {
//     console.log('the failure=>',err);
//   },
//   complete: () => { }
// });
}

getPreviewUrl(f: File) {
return this.sanitizer.bypassSecurityTrustResourceUrl(encodeURI(URL.createObjectURL(f)));
}

onRemove(event: any) {
this.files.splice(this.files.indexOf(event), 1);
this.adminService.deleteImageLogoFromOrgDb(this.id).subscribe({
  next: (res) => {
    console.log('the success=>',res);
    this.srcImage = '';

  },
  error: (err) => {
    console.log('the failure=>',err);
  },
  complete: () => { }
});
}


}

