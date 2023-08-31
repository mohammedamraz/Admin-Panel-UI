import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ChartDataset } from '../pages/charts/chartjs/chartjs.model';
import { ApexChartOptions } from '../pages/charts/apex/apex-chart.model';
import { Chart } from 'chart.js'; // Import the Chart class

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  barChartOptions2: Partial<ApexChartOptions> = {};
  pieChartOptions!: ChartDataset;
  lineChartOptions!: ChartDataset;
  activeStatusOptions:any= ['All Org', 'Active Org','Inactive Org'];
  OrgOptions:any= ['All','ABSLI', 'CanaraHsbc','Aviva']
  activeStatusValue: any= this.activeStatusOptions[1];
  activeOrgValue: any= this.OrgOptions[0]
  myChart :any
  elementRef: any;
  orglogin:boolean=false;
  userlogin:boolean=true;
  orgChange:boolean = false;

  public barChartOptions: any=[];
  constructor(private renderer: Renderer2) { }



ngOnInit(): void {
  console.log('hiiii ana');
  

  let data:any =  JSON.parse(sessionStorage.getItem('currentUser')!);  
  if(data.hasOwnProperty('orglogin')){
    if(data.orglogin){
      this.orglogin=true;
    }
    else{
      this.orglogin=true;
      this.userlogin=false;
    }
  }

    this.barChartOptions = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: ["January", "February", "March", "April", "April","January", "February", "March", "April", "April","January", "February", "March", "April", "April","January", "February", "March", "April", "April","January", "February", "March", "April", "April","January", "February", "March", "April", "April",],
        datasets: [
            {
                label: "Sales Analytics",
                backgroundColor: "#AD88F1",
                borderColor: "#AD88F1",
                borderWidth: 1,
                hoverBackgroundColor: "#AD88F1",
                hoverBorderColor: "#AD88F1",
                data: [65, 59, 80, 81,45,65, 59, 80, 81,45,65, 59, 80, 81,45,65, 59, 80, 81,45,65, 59, 80, 81,45,65, 59, 80, 81,45,]
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
                data: [300, 50, 100],
                backgroundColor: [
                    "#ff8acc",
                    "#5b69bc",
                    "#f1b53d",
                    
                ],
                hoverBackgroundColor: [
                    "#ff8acc",
                    "#5b69bc",
                    "#f1b53d"
                ],
                hoverBorderColor: "#fff"
            }],
    },
    chartOptions: {
        maintainAspectRatio: false,
    }
}

this.lineChartOptions =
{
    type: 'line',
    data: {
        labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September"],
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
            data: [65, 59, 80, 81, 56, 55, 40, 35, 30]
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
    

    
  }
  checkOrgValue(event:any){
    console.log("events",event.target.value);
    this.orglogin = true
    if(event.target.value =='All')
    this.orglogin = false
    console.log("All change");
    
    
  }
  



}
