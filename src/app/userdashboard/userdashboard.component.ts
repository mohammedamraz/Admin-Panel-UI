import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../core/service/auth.service';
import { ApexChartOptions } from '../pages/charts/apex/apex-chart.model';
import { ChartDataset } from '../pages/charts/chartjs/chartjs.model';
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
  barChartOptions : ChartDataset = {
    type: 'bar',
    data: {
        labels: ["January", "February", "March"],
        datasets: [
            {
                label: "Sales Analytics",
                backgroundColor: "RGBA(3,149,253,0.3)",
                borderColor: "#0388FD",
                borderWidth: 1,
                hoverBackgroundColor: "RGBA(3,149,253,0.6)",
                hoverBorderColor: "#0388FD",
                data: [65,89 , 80,]
            },
            
        ],
        
    },
    chartOptions: {
        maintainAspectRatio: false,
    }
}
chartOptions: Partial<ApexChartOptions> = {
  series: [
    {
      name: 'Series A',
      type: 'area',
      data: [50, 75, 30,],
    },
    {
      name: 'Series B',
      type: 'line',
      data: [0, 40, 80, ],
    },
  ],
  chart: {
    height: 268,
    type: 'line',
    toolbar: {
      show: false,
    },
    stacked: false,
    zoom: {
      enabled: false,
    },
  },
  stroke: {
    curve: 'smooth',
    width: [3, 3],
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
  },
  fill: {
    type: 'solid',
    opacity: [0, 1],
  },
  colors: ['#3cc469', '#188ae2'],
  xaxis: {
    categories: ['W1', 'W2', 'W3', ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      style: {
        colors: '#adb5bd',
      },
    },
  },
  yaxis: {
    tickAmount: 4,
    min: 0,
    max: 100,
    labels: {
      style: {
        colors: '#adb5bd',
      },
    },
  },
  grid: {
    show: false,
    padding: {
      top: 0,
      bottom: 0,
    },
  },
  tooltip: {
    theme: 'dark',
  },

};





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
