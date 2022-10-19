import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/core/service/auth.service';

@Component({
  selector: 'app-auth-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor (
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute
  ) { }

  admin:boolean=false;

  ngOnInit(): void {
    this.authenticationService.logout();
    this.route.queryParams.subscribe((params:any)=>{
      console.log('asdf',params)
      if(params.status=="active"){
        this.admin=true;
      }
    });
  }

}
