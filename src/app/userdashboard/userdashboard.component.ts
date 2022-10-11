import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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



  constructor(
    private readonly route: ActivatedRoute,
    private readonly adminService: AdminConsoleService,
    private authService: AuthenticationService,



  ) { }

  
  ngOnInit(): void {
    this.loggedInUser = <any>this.authService.currentUser();
    this.orgId = this.route.snapshot.paramMap.get("orgId");
    this.prodId = this.route.snapshot.paramMap.get("Id");
    console.log('asdf',this.prodId)
    this.adminService.fetchUserProdById(this.loggedInUser.user_data[0].id).subscribe({
      next:(res:any) =>{
        // console.log('hi girls', res)
        const selected =res.findIndex((obj:any)=>obj.product_id.toString() === this.prodId);
        this.product= res[selected];
        console.log('asdw',this.product);
      }});
      this.adminService.fetchUserScan(this.loggedInUser.user_data[0].id,this.prodId).subscribe({
        next:(res:any) =>{
          this.testScan = res.total_tests
        }});
  }


  playstore(data:any,url_type:string){
    if(url_type=="mobile") {let redirectWindow = window.open(data);}
    else {let redirectWindow = window.open("https://www.google.com");}
   // redirectWindow.location;
    
  }

}
