import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ChartDataset } from '../pages/charts/chartjs/chartjs.model';
import { ApexChartOptions } from '../pages/charts/apex/apex-chart.model';
import { Chart, TimeScale } from 'chart.js'; // Import the Chart class
import { AdminConsoleService } from '../services/admin-console.service';
import { log } from 'console';
import { ActivatedRoute } from '@angular/router';
import { newArray } from '@angular/compiler/src/util';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  barChartOptions2: Partial<ApexChartOptions> = {};
  pieChartOptions!: ChartDataset;
  lineChartOptions : ChartDataset  =
  {
      type: 'line',
      data: {
          labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September",'October',"November","December"],
          datasets: [{
              label: "Sales Analytics",
              fill: false,
              backgroundColor: "#10c469",
              borderColor: "#10c469",
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: "#039cfd",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "#039cfd",
              pointHoverBorderColor: "#eef0f2",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: [10],
              
          }],
      },
      chartOptions: {
          maintainAspectRatio: false,
          plugins: {
              filler: {
                  propagate: false,
              },
              legend: {
                  display: true,
              },
              tooltip: {
                  intersect: false,
              },
          },
          scales: {
              y: {
                  ticks: {
                      stepSize: 10,
                  },
  
              },
          },
      },
  };
  lineChart:any={}
  // barChart:any
  activeStatusOptions:any= ['All Org', 'Active Org','Inactive Org'];
  OrgOptions:any= ['All','ABSLI', 'CanaraHsbc','Aviva']
  activeStatusValue: any= this.activeStatusOptions[1];
  activeOrgValue: any= this.OrgOptions[0]
  myChart :any
  elementRef: any;
  orglogin:boolean=false;
  userlogin:boolean=true;
  orgChange:boolean = false;
  loginOrg:boolean = false;
  usersCount:any=0;
  created_date:any;
  todayDate = new Date();
  startDate:any = '2022-10-08'
  endDate: any = '2023-10-08'
 



  totalScan:any;
  monthScan:any;
  todayScan:any;
  snapshotParam:any;


  monthlyScans:any[]=[];
  public barChartOptions: any=[];
  public newBarChart: any = [];


 
 
  constructor(private renderer: Renderer2,
    private readonly adminService: AdminConsoleService,
    private readonly route: ActivatedRoute,
    ) { }



ngOnInit(): void {
  console.log('hiiii ajnbvjvjhvjhvjhvjhvjhvjhna',this.todayDate);



  let data:any =  JSON.parse(sessionStorage.getItem('currentUser')!); 
  console.log("-----------------gffg------------",data);
   
  console.log('-----------hsdhfsd-----------',data.hasOwnProperty('orglogin') );
  
  if(data.hasOwnProperty('orglogin')){
    if(data.orglogin){
      this.orglogin=true;

    }
  
  }
  else{
    this.loginOrg = true
  }
  this.snapshotParam = this.route.snapshot.paramMap.get("orgId");
  console.log("----------snap-------",this.snapshotParam);
  


this.apiFuntions();

  this.barChartOptions2 = {
      series: [
        
        {
          // name: 'Reborn Kid',
          data: [25, 12, 25, 24, 10],
        },
      ],
      chart: {
        height: 380,
        type: 'bar',
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      stroke: {
        show: false,
      },
      xaxis: {
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
      },
      axisTicks: {
        show: false,
    },
        
 
      
      },
      yaxis: {
        show: false,
        axisBorder: {
          show: false,
          // color: '#10baee'
      },
        // title: {
        //   text: undefined,
        // },
      },
      colors: [ '#FF3131'],
      
    };

    this.pieChartOptions = {
    type: 'pie',
    data: {
        labels: [
            "Life",
            "GI",
            "Hospital",
            "Public Health",
            "bank",
            "Health Tech"
        ],
        datasets: [
            {
                data: [200, 144, 100,150,250,170],
                backgroundColor: [
                    "#ff8acc",
                    "#5b69bc",
                    "#f1b53d",
                    "#008080",
                    "#EC6B56",
                    "#AADEA7",
                ],
                hoverBackgroundColor: [
                    "#ff8acc",
                    "#5b69bc",
                    "#f1b53d",
                    "#008080",
                    "#EC6B56",
                    "#AADEA7",
                ],
                hoverBorderColor: "#fff"
            }],
    },
    chartOptions: {
        maintainAspectRatio: false,
    }
}



    
  }
  checkOrgValue(event:any){
    console.log("events",event.target.value);
    if(event.target.value =='All'){
      this.orglogin = false
      console.log("All change");
      
    }else
    this.orglogin = true
   

  }

apiFuntions(){
  
  if(this.orglogin == true){
    console.log("orglogin");
    this.adminService.fetchVitalsDashboardbyId(this.snapshotParam).subscribe((doc:any)=>{
      this.monthScan = doc.total_tests_this_month
      this.todayScan = doc.total_tests_today
      this.totalScan = doc.total_tests_till_now
      
    })

    this.adminService.fetchScansByMonthByOrgId(2023,this.snapshotParam).subscribe((doc:any)=>{
    this.monthlyScans = doc.total_tests_this_month
    this.updateLineChartData()
    this.lineChart = this.lineChartOptions
    })
    console.log("org id",this.snapshotParam);
    

    this.adminService.fetchScansOfUsers(this.snapshotParam,'2022-10-08','2023-09-10').subscribe((doc:any)=>{

      this.usersCount = doc.length
      
      
      const testsArray = doc.map((item:any) => item.tests);
      const nameArray = doc.map((item:any) => item.user_name);
      
  
      console.log("Tests Array:", testsArray);
      console.log("Org Name Array:", nameArray);    
      this.updateBarChartData(testsArray,nameArray)
      
    })
    


    
  }
  else{
  console.log("login");
  this.adminService.fetchVitalsDashboard().subscribe((doc:any)=>{
    console.log("mydoc superadmin",doc);
    this.monthScan = doc.total_tests_this_month
    this.todayScan = doc.total_tests_today
    this.totalScan = doc.total_tests_till_now
    
    
  })
  this.adminService.fetchScansByMonth(2023).subscribe((doc:any)=>{
    console.log("iiiiiiiiiiiOiiiiiiiii",doc);

    
    this.monthlyScans = doc.total_tests_this_month
    this.updateLineChartData()
    this.lineChart = this.lineChartOptions
   
    
  })

  this.adminService.fetchScansOfOrg('2022-10-08','2023-09-10').subscribe((doc:any)=>{
    console.log("newwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww docyy",doc);
    const testsArray = doc.map((item:any) => item.tests);
    const nameArray = doc.map((item:any) => item.org_name);

    console.log("Tests Array:", testsArray);
    console.log("Org Name Array:", nameArray);    
    this.updateBarChartData(testsArray,nameArray)
  
    
    // this.barChart = this.barChartOptions
    // console.log("---------------aaaaaaaaaaaa----------",this.barChart);
    
    
    
  })
  this.adminService.fetchScansOfIndustry().subscribe((doc:any)=>{
    console.log("pie chart",doc);
    const testsArray = doc.map((item:any) => item.tests);
    this.updatePieChart(testsArray)
    
  })


 
}



}  

updateLineChartData() {

  if (this.lineChartOptions.data && this.lineChartOptions.data.datasets) {
    this.lineChartOptions.data.datasets[0].data = this.monthlyScans;
  }
  

  // this.lineChartOptions.data?.datasets[0].data = this.monthlyScans
  // this.lineChartOptions.data?.datasets
  
}
updateBarChartData(test:any,name:any){
 this.barChartOptions = new Chart('canvas', {
  type: 'bar',
  data: {
    labels: name,
    datasets: [
        {
            label: "Sales Analytics",
            backgroundColor: "#AD88F1",
            borderColor: "#AD88F1",
            borderWidth: 1,
            hoverBackgroundColor: "#AD88F1",
            hoverBorderColor: "#AD88F1",
            data: test
        }
    ],
},
  options: {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

    const containerBody = document.querySelector('.container-body') as HTMLElement;
    const totalLabels = this.barChartOptions.config._config.data.labels.length
     if(totalLabels>5){
      const newWidth = 450 + ((totalLabels-5)*70)
      containerBody.style.width=`${newWidth}px`


     }
}
  
  updatePieChart(data: any){
  this.pieChartOptions = {
    type: 'pie',
    data: {
        labels: [
            "Life",
            "GI",
            "Hospital",
            "Public Health",
            "bank",
            "Health Tech"
        ],
        datasets: [
            {
                data: data,
                backgroundColor: [
                    "#ff8acc",
                    "#5b69bc",
                    "#f1b53d",
                    "#008080",
                    "#EC6B56",
                    "#AADEA7",
                ],
                hoverBackgroundColor: [
                    "#ff8acc",
                    "#5b69bc",
                    "#f1b53d",
                    "#008080",
                    "#EC6B56",
                    "#AADEA7",
                ],
                hoverBorderColor: "#fff"
            }],
    },
    chartOptions: {
        maintainAspectRatio: false,
    }
}
}
checkDate(startDate:any,endDate:any){
  console.log("date",startDate,endDate);
  
}


}
