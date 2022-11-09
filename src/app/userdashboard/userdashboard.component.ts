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
  userId:any=undefined;
  product:any={};
  loggedInUser: any={};
  prodId:any=0;
  testScan:any = 0;
  show:boolean = false; 
  days:any=0;
  @ViewChild('toggleModal4', { static: true }) input!: ElementRef;
  graphArray:any[]=[];
  monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
dateSelected:any=new Date().toISOString().substring(0, 10);
products:any=[];



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
  user_name:any
  email:any
  mobile:any
  designation:any

  
  ngOnInit(): void {
    let data:any =  JSON.parse(sessionStorage.getItem('currentUser')!);
    // if(data.user_data){
    this.loggedInUser = <any>this.authService.currentUser();

      if(this.loggedInUser.user_data){
        this.route.params.subscribe((val:any) =>{
          this.show=false;
          this.orgId = val.orgId;
          this.userId = this.loggedInUser.user_data[0].id;
          
          this.prodId = val.Id;    
        }) 

        //here we should be calling the fetchorgbyid and giving the condition and calling the popup once org is inactive 

        if(this.loggedInUser.user_data[0].is_deleted){
          this.open(<TemplateRef<NgbModal>><unknown>this.input);
        }
        

      }
      else { 
        this.route.params.subscribe((val:any) =>{
          this.show=false;
          this.orgId = val.orgId;
          this.userId = val.userId;
          
          this.prodId = val.Id;    
        })

      }

    
      this.adminService.fetchUserListById(this.userId).subscribe({
        next:(data:any)=>{
          console.log("data",data)
          this.user_name = data[0].user_name;
        this.email = data[0].email;
        this.mobile = data[0].mobile;
        this.designation = data[0].designation;

        }
      })
      this.adminService.fetchUserProdById(this.userId).subscribe({
        next:(res:any) =>{
          this.products = res;
          
          this.createGraphArrayItems(this.products,this.dateSelected);
         

          const selected =res.findIndex((obj:any)=>obj.product_id.toString() === this.prodId);
          this.product= res[selected];
          this.adminService.fetchOrgById(this.product.org_id).subscribe({
            next:(res:any) =>{  
              const spotted =res[0].product.findIndex((obj:any)=>obj.product_id.toString() === this.prodId);
              this.days = res[0].product[spotted].pilot_duration
              if(res[0].product[spotted].status =="Expired"){
                this.days = res[0].product[spotted].pilot_duration
                // here there should be change for the pilot expired error thats coming while switching the dashboard
                this.show=true
              }
                  }});
          
        }});
        this.adminService.fetchUserScan(this.userId,this.prodId).subscribe({
          next:(res:any) =>{
            this.testScan = res.total_tests 
          }});
    // })
    
    

    


  }
  createGraphArrayItems(products:any,date:any){

    console.log('aksjdfhlkjasdhflkashdf =>',  this.prodId)


    if(this.prodId==undefined)
      this.graphArray = products.map((doc:any) => {
        return this.fetchgraphdetails(doc.product_id,date)
      });
    else{
      this.graphArray = [this.fetchgraphdetails(this.prodId.toString(),date)]
    }



  }
  fetchgraphdetails(prodId:any,date:any,){
    let graphdetails:any = {}; 
    this.adminService.fetchUsersDailyScan(this.userId,prodId,date).subscribe((doc:any)=>{
      console.log('usergraph',doc);
      
      graphdetails['today'] = doc[0].total_user_tests;
      graphdetails['yesterday'] = doc[0].total_user_tests_onedaybefore;
      graphdetails['previousDay'] = doc[0].total_user_tests_twodaybefore;
      graphdetails['totalScans'] = doc[0].total_user_tests;
      graphdetails['standardModeScans'] = doc[0].total_user_tests_standard?doc[0].total_user_tests_standard:0;
      graphdetails['eventModeScans'] = doc[0].total_user_tests_event?doc[0].total_user_tests_event:0;
      graphdetails['name'] =  prodId === '1' ? 'HSA' : (prodId === '2' ? 'Vitals':'RUW' )
    })
    // graphdetails['today'] = 3;
      // graphdetails['yesterday'] = 4
      // graphdetails['previousDay'] = 2;
      // graphdetails['totalScans'] = 5;
      // graphdetails['standardModeScans'] =6;
      // graphdetails['eventModeScans'] =3;
      graphdetails['prodId'] = prodId;
      graphdetails['date'] = date
      // graphdetails['name'] =prodId === '1' ? 'HSA' : (prodId === '2' ? 'Vitals':'RUW' );
      graphdetails['graph'] = {
        type: 'bar',
        data: {
          labels: this.fetchDates(date),
          datasets: [
              {
                  backgroundColor: ["RGBA(104, 116, 129, 0.5)","RGBA(104, 116, 129, 0.5)","RGBA(242, 202, 101, 0.5)"],
                  borderColor: "#ADB5BD",
                  borderWidth: 1,
                  hoverBackgroundColor: "#ADB5BD",
                  hoverBorderColor: "#ADB5BD",
                  data: [graphdetails['previousDay'],  graphdetails['yesterday'] , graphdetails['today']],
                  
              },
          ],
      },
      chartOptions: {
          maintainAspectRatio: false,
          
          
      },}

    return graphdetails
  }
  fetchDates(date:any){

    const datechecked = new Date(date);
    const yesterday = new Date((new Date(date)).valueOf() - 1000*60*60*24)
    const previousDay = new Date((new Date(date)).valueOf() - 1000*60*60*48)

    console.log('oyul =>', datechecked)
    return [this.getDate(previousDay),this.getDate(yesterday),this.getDate(datechecked)]
  }
  getDate(date:any){
    return  this.monthNames[new Date(date).getMonth()].slice(0,3) +' ' +new Date(date).getDate()
   }

  checkdate(event:any,prodId:any,date:any){
    console.log('hello date =>', date);
    console.log('date selected => ', event);
    const index = this.graphArray.findIndex(prod => prodId === prod.prodId);
    this.graphArray[index] = this.fetchgraphdetails(prodId,new Date(date).toISOString().substring(0, 10));
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
