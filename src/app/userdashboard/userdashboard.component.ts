import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../core/service/auth.service';
import { AdminConsoleService } from '../services/admin-console.service';

@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.scss']
})
export class UserdashboardComponent implements OnInit {

  orgId:any=0;
  product:any={};
  loggedInUser: any={};
  prodId:any=0;
  testScan:any = 0;
  show:boolean = false; 
  days:any=0;
  @ViewChild('toggleModal4', { static: true }) input!: ElementRef;




  constructor(
    private readonly route: ActivatedRoute,
    private readonly adminService: AdminConsoleService,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private authenticationService: AuthenticationService,

  ) { }

  
  ngOnInit(): void {
    this.loggedInUser = <any>this.authService.currentUser();
    // this.orgId = this.route.snapshot.paramMap.get("orgId");
    // this.prodId = this.route.snapshot.paramMap.get("Id");
    // console.log('asdf',this.prodId)
    if(this.loggedInUser.user_data[0].is_deleted){
      this.open(<TemplateRef<NgbModal>><unknown>this.input);
    }

    this.route.params.subscribe((val:any) =>{
      this.show=false;
      this.orgId = val.orgId;
      this.prodId = val.Id;
      this.adminService.fetchUserProdById(this.loggedInUser.user_data[0].id).subscribe({
        next:(res:any) =>{
          console.log('hi girls', res)
          const selected =res.findIndex((obj:any)=>obj.product_id.toString() === this.prodId);
          this.product= res[selected];
          console.log('asdw',this.product);
          this.adminService.fetchOrgById(this.product.org_id).subscribe({
            next:(res:any) =>{  
              const spotted =res[0].product.findIndex((obj:any)=>obj.product_id.toString() === this.prodId);
              this.days = res[0].product[spotted].pilot_duration
              if(res[0].product[spotted].status =="Expired"){
                this.days = res[0].product[spotted].pilot_duration
                this.show=true
              }
                  }});
          
        }});
        this.adminService.fetchUserScan(this.loggedInUser.user_data[0].id,this.prodId).subscribe({
          next:(res:any) =>{
            this.testScan = res.total_tests 
          }});
    })
  }


  playstore(data:any,url_type:string){
    if(url_type=="mobile") {let redirectWindow = window.open(data);}
    // else {
    //   let redirectWindow = window.open("https://www.google.com");}
   // redirectWindow.location;
    
  }

  open(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { centered: true,keyboard : false, backdrop : 'static' });
  }

  reloadCurrentPage() {
    window. location. reload();
    }

  closeUser(){
    this.authenticationService.logout();
    this.reloadCurrentPage();
  }

}
