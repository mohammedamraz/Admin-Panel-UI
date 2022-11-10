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
    
    this.route.params.subscribe((val:any) =>{
      this.graphArray = [];
    console.log("erthtdhfhgdgdgdthhg hielmdall");
    
    let data:any =  JSON.parse(sessionStorage.getItem('currentUser')!);
    this.loggedInUser = <any>this.authService.currentUser();

    //check which id is 
    
    // if(data.user_data){

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

      console.log("org_id",this.product.org_id);
      this.adminService.fetchUserListById(this.userId).subscribe({
        next:(data:any)=>{
          console.log("data",data)
          this.user_name = data[0].user_name;
        this.email = data[0].email;
        this.mobile = data[0].mobile;
        this.designation = data[0].designation;

        }
      })
      console.log("org_id",this.product.org_id);
      this.adminService.fetchUserProdById(this.userId).subscribe({
        next:(res:any) =>{
          this.products = res;
          
         

          const selected =res.findIndex((obj:any)=>obj.product_id.toString() === this.prodId);
          this.product= res[selected];
          // console.log("org_id",this.product.org_id);
          
          this.adminService.fetchOrgById(this.orgId).subscribe({
            next:(res:any) =>{  
              const spotted =res[0].product.findIndex((obj:any)=>obj.product_id.toString() === this.prodId);

              if(this.prodId==undefined){
                this.createGraphArrayItems(this.products,this.dateSelected);
                      if(this.loggedInUser.user_data){
                        if(res[0].is_deleted){
                          this.open(<TemplateRef<NgbModal>><unknown>this.input);
                        }
                
          
        }
                

              }
              else{
                this.products= res[0].product[spotted];
                this.createGraphArrayItems([this.products],this.dateSelected);

              }
              
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
    
    

    

  });
  }
  async createGraphArrayItems(products:any,date:any){

    console.log('where is id =>',  this.prodId)


    if(this.prodId==undefined){
      console.log("products",products);
      const requests = products.map((doc:any) =>
      this.fetchGraphs(doc.product_id,date));
    Promise.all(requests).then(body => { 
        body.forEach(res => {
          console.log('higeass =>',res)
        this.graphArray.push(res)
        })
     });
      //  {
      //   return this.fetchgraphdetails(doc.product_id,date)
      // });
    }
    else{
      console.log("products",products);
      
      const requests = products.map((doc:any) =>
      this.fetchGraphs(doc.product_id,date));
    Promise.all(requests).then(body => { 
        body.forEach(res => {
          console.log('higeass =>',res)
        this.graphArray.push(res)
        })
     });
    }



  }

  fetchGraphs(prodId:any,date:any){

    return new Promise((resolve, reject) => {
      const graph = this.fetchgraphdetails(prodId,date);
      const performance = this.fetchPerformanceDetails(prodId,'monthly')
      let details:any ={}
      Promise.all([graph]).then(bodyGraph => { 
        bodyGraph.forEach(res => {
          details = res;
          Promise.all([performance]).then(body => { 
            body.forEach(pergormanceDetails => {
              details['performance'] = pergormanceDetails
            })
         })
        })
        console.log('why this kolaveri =>',details)
        resolve(details)
     })
    })

  }

  fetchPerformanceDetails(prodId:any,period:any){
    
    return new Promise((resolve, reject) => {
      this.adminService.fetchUserPerformanceChart(this.userId,prodId,period).subscribe((doc:any)=>{
      let performaceDetails:any={}      

      performaceDetails['currentMonth'] = doc[0].total_org_tests ? doc[0].total_org_tests : 0;
      performaceDetails['previousMonth'] = doc[1].total_org_tests ? doc[1].total_org_tests : 0;
      performaceDetails['varience'] = doc[2].variance ? doc[2].variance : 0;
      performaceDetails['quaterOne'] = doc[0].quarter_one_tests ? doc[0].quarter_one_tests : 0;
      performaceDetails['quaterTwo'] = doc[0].quarter_two_tests ? doc[0].quarter_two_tests : 0;
      performaceDetails['quaterThree'] = doc[0].quarter_three_tests ? doc[0].quarter_three_tests : 0;
      performaceDetails['quaterFour'] = doc[0].quarter_four_tests ? doc[0].quarter_four_tests : 0;
      performaceDetails['PreviousQuaterOne'] = doc[1].quarter_one_tests ? doc[1].quarter_one_tests: 0 ;
      performaceDetails['PreviousQuaterTwo'] = doc[1].quarter_two_tests ? doc[1].quarter_two_tests : 0;
      performaceDetails['PreviousQuaterThree'] = doc[1].quarter_three_tests ? doc[1].quarter_three_tests: 0;
      performaceDetails['PreviousQuaterFour'] = doc[1].quarter_four_tests ? doc[1].quarter_four_tests : 0;
      performaceDetails['name'] =  prodId === 1 ? 'HSA' : (prodId === 2 ? 'Vitals':'RUW' )
      performaceDetails['currentUserEmail'] = doc[0].user_email;
      performaceDetails['currentUserNmae'] = doc[0].user_name==undefined?'NaN':doc[0].user_name;
      performaceDetails['PreviouseUserEmail'] = doc[1].user_email;
      performaceDetails['PreviouseUserName'] = doc[1].user_name==undefined?'NaN':doc[1].user_name;
      performaceDetails['prodId']=prodId;
      performaceDetails['period']=period;

      performaceDetails['graph']={
        series: [
          {
            name: 'Series A',
            type: 'area',
            data: [performaceDetails['quaterOne'],performaceDetails['quaterTwo'], performaceDetails['quaterThree'], performaceDetails['quaterFour']],
          },
          {
            name: 'Series B',
            type: 'line',
            data: [performaceDetails['PreviousQuaterOne'],performaceDetails['PreviousQuaterTwo'], performaceDetails['PreviousQuaterThree'],performaceDetails['PreviousQuaterFour']],
          },
        ],
        chart: {
          height: 268,
          type: 'line',
          toolbar: {
            show: false,
          },
          stacked: true,
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
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },

        fill: {
          type: 'solid',
          opacity: [0, 1],
        },
        colors: ['#188ae2', '#F08FC9'],
        xaxis: {
          categories: ['Q1', 'Q2', 'Q3', 'Q4' ],
          axisBorder: {
            show: true,
            color: '#f7f7f7'
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
          // min: 0,
          // max: 100,
          labels: {
            style: {
              colors: '#adb5bd',
            },
         },
         axisBorder: {
          show: true,
          color: '#f7f7f7'
         }
        },
        grid: {
          show: true,
          borderColor: '#f7f7f7',
          // padding: {
          //   top: 0,
          //   bottom: 0,
          // },
        },
        tooltip: {
          theme: 'dark',
        },
      }
      resolve(performaceDetails)
       // performaceDetails['totalScans'] = doc[0].total_org_tests;
      // performaceDetails['standardModeScans'] = doc[0].total_org_tests_standard ? doc[0].total_org_tests_standard : 0 ;
      // performaceDetails['eventModeScans'] = doc[0].total_org_tests_event ? doc[0].total_org_tests_event : 0;
      // performaceDetails['name'] =  prodId === '1' ? 'HSA' : (prodId === '2' ? 'Vitals':'RUW' )   
    })
    })
  }

  fetchTimely(prodId:any,data:any){
    console.log('hello musicians', data);
    const index = this.graphArray.findIndex(prod => prodId === prod.prodId);
    this.graphArray[index].performance.period = data
    const performance = this.fetchPerformanceDetails(prodId,data)
    Promise.all([performance]).then(body => { 
      body.forEach(pergormanceDetails => {
        this.graphArray[index].performance = pergormanceDetails
      })
   })
  }


  fetchgraphdetails(prodId:any,date:any,){
    let graphdetails:any = {}; 
    this.adminService.fetchUsersDailyScan(this.userId,prodId,date).subscribe((doc:any)=>{
      console.log('usergraph',doc,prodId);
      
      graphdetails['today'] = doc[0].total_user_tests;
      graphdetails['yesterday'] = doc[0].total_user_tests_onedaybefore;
      graphdetails['previousDay'] = doc[0].total_user_tests_twodaybefore;
      graphdetails['totalScans'] = doc[0].total_user_tests;
      graphdetails['standardModeScans'] = doc[0].total_user_tests_standard?doc[0].total_user_tests_standard:0;
      graphdetails['eventModeScans'] = doc[0].total_user_tests_event?doc[0].total_user_tests_event:0;
      graphdetails['name'] =  Number(prodId) === 1 ? 'HSA' : (Number(prodId) === 2 ? 'Vitals':'RUW' )
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
