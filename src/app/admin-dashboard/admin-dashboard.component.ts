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
  lineChartOptions: ChartDataset =
    {
      type: 'line',
      data: {
        labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", 'October', "November", "December"],
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
  lineChart: any = {}
  // barChart:any
  activeStatusOptions: any = [];
  OrgOptions: any = []
  activeStatusValue: any = '';
  array: any = '';
  newArray: any = '';
  activeOrgValue: any = this.activeStatusOptions[1];
  yearValue: any[] = [];
  initialYearValue: any
  myChart: any
  elementRef: any;
  orglogin: boolean = false;
  userlogin: boolean = true;
  orgChange: boolean = false;
  loginOrg: boolean = false;
  usersCount: any = 0;
  created_date: any;
  todayDate: any
  startDate: any = '2022-10-08'
  endDate = new Date().toISOString().split('T')[0]
  configVitals: any[] = []
  orgDetails: any[] = [];
  verisons: any[] = []




  totalScan: any;
  monthScan: any;
  todayScan: any;
  snapshotParam: any;
  year: any;
  industryArray: any[] = [];
  testsArray: any[] = []


  monthlyScans: any[] = [];
  public barChartOptions: any = [];
  public newBarChart: any = [];




  constructor(private renderer: Renderer2,
    private readonly adminService: AdminConsoleService,
    private readonly route: ActivatedRoute,
  ) { }



  ngOnInit(): void {

    this.activeOrgValue = this.activeStatusOptions[0];
    let date = new Date()
    this.todayDate = date.toISOString().split('T')[0];


    this.adminService.fetchVersions().subscribe((doc: any) => {
      this.activeStatusOptions = doc;
      const newObject = { version: 'All Versions', id: '' };
      this.activeStatusOptions.unshift(newObject);

    })



    let data: any = JSON.parse(sessionStorage.getItem('currentUser')!);

    if (data.hasOwnProperty('orglogin')) {
      if (data.orglogin) {
        this.orglogin = true;

      }

    }
    else {
      this.loginOrg = true
    }

    this.snapshotParam = this.route.snapshot.paramMap.get("orgId");
    if (this.snapshotParam != null) {
      this.adminService.fetchOrgById(this.snapshotParam).subscribe((doc: any) => {
        const filterObj = doc[0].product.filter((e: any) => e.product_id == 2);
        this.configVitals = filterObj
      })
    }
    // Get the current year
    this.year = new Date().getFullYear();

    // Create an array of the last 10 years
    this.yearValue = Array.from({ length: 10 }, (_, index) => this.year - index);
    this.initialYearValue = this.yearValue[0]


    this.adminService.fetchIndustry().subscribe((doc: any) => {
      this.industryArray = doc


    })


    this.apiFuntions();


    this.barChartOptions2 = {
      series: [

        {
          data: [0, 0, 0, 0, 0],
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
      colors: ['#FF3131'],

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
            data: [200, 144, 100, 150, 250, 170],
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
  checkOrgValue(event: any) {

    this.snapshotParam = event.value
    this.lineChart = [];

    if (event.value != '') {
      this.orglogin = true
      this.adminService.fetchVitalsDashboardbyId(this.snapshotParam, this.activeStatusValue).subscribe((doc: any) => {
        this.monthScan = doc.total_tests_this_month
        this.todayScan = doc.total_tests_today
        this.totalScan = doc.total_tests_till_now

      })

      this.adminService.fetchScansByMonthByOrgId(this.year, this.snapshotParam, this.activeStatusValue).subscribe((doc: any) => {
        this.monthlyScans = doc.total_tests_this_month
        this.updateLineChartData()
        this.lineChart = this.lineChartOptions
      })

      this.adminService.fetchScansOfUsers(this.snapshotParam, this.startDate, this.todayDate, this.activeStatusValue).subscribe((doc: any) => {
        this.usersCount = doc.length
        if (this.barChartOptions) {
          this.barChartOptions.destroy();
        }

        const testsArray = doc.map((item: any) => item.tests);
        const nameArray = doc.map((item: any) => item.user_name);

        this.updateBarChartData(testsArray, nameArray)

      })

      this.adminService.fetchOrgById(this.snapshotParam).subscribe((doc: any) => {
        const filterObj = doc[0].product.filter((e: any) => e.product_id == 2);
        this.configVitals = filterObj

      })
    }
    else {
      this.orglogin = false;

      this.adminService.fetchVitalsDashboard(this.activeStatusValue).subscribe((doc: any) => {
        this.monthScan = doc.total_tests_this_month
        this.todayScan = doc.total_tests_today
        this.totalScan = doc.total_tests_till_now


      })
      this.adminService.fetchScansByMonth(this.year, this.activeStatusValue).subscribe((doc: any) => {
        this.monthlyScans = doc.total_tests_this_month
        this.updateLineChartData()
        this.lineChart = this.lineChartOptions


      })

      this.adminService.fetchScansOfOrg(this.startDate, this.todayDate, this.activeStatusValue).subscribe((doc: any) => {
        this.orgDetails = doc;
        const newObject = { org_name: 'All Organization', org_id: '' };

        // Add the new object to the beginning of the array
        this.orgDetails.unshift(newObject);

        if (this.barChartOptions) {
          this.barChartOptions.destroy();
        }

        const testsArray = doc.map((item: any) => item.tests);
        const nameArray = doc.map((item: any) => item.org_name);

        this.updateBarChartData(testsArray, nameArray)

      })
      this.adminService.fetchScansOfIndustry(this.startDate, this.todayDate, this.activeStatusValue).subscribe((doc: any) => {

        this.name_array = []
        const testsArray = doc.map((item: any) => item.response_percentage);
        this.testsArray = testsArray
        doc.forEach((element: any) => {
          const nameArray = this.industryArray.filter((item: any) => item.id == Number(element.industry_id));
          this.name_array.push(nameArray[0].industry)
        })

        this.updatePieChart(testsArray, this.name_array)
      })



    }


  }
  checkYear(event: any) {
    this.lineChart = [];
    this.year = event.target.value

    if (this.orglogin == true) {
      this.adminService.fetchScansByMonthByOrgId(this.year, this.snapshotParam, this.activeStatusValue).subscribe((doc: any) => {
        this.monthlyScans = doc.total_tests_this_month
        this.updateLineChartData()
        this.lineChart = this.lineChartOptions;
        return this.lineChart;
      })
    }
    else {
      this.adminService.fetchScansByMonth(this.year, this.activeStatusValue).subscribe((doc: any) => {
        this.monthlyScans = doc.total_tests_this_month
        if (this.lineChartOptions.data && this.lineChartOptions.data.datasets) {
          this.lineChartOptions.data.datasets[0].data = this.monthlyScans;
        }

        this.lineChart = this.lineChartOptions
        return this.lineChart;


      })

    }


  }

  name_array: any = [];

  apiFuntions() {

    if (this.orglogin == true) {
      this.adminService.fetchVitalsDashboardbyId(this.snapshotParam, this.activeStatusValue).subscribe((doc: any) => {
        this.monthScan = doc.total_tests_this_month
        this.todayScan = doc.total_tests_today
        this.totalScan = doc.total_tests_till_now

      })

      this.adminService.fetchScansByMonthByOrgId(this.year, this.snapshotParam, this.activeStatusValue).subscribe((doc: any) => {
        this.monthlyScans = doc.total_tests_this_month
        this.updateLineChartData()
        this.lineChart = this.lineChartOptions
      })

      this.adminService.fetchScansOfUsers(this.snapshotParam, this.startDate, this.todayDate, this.activeStatusValue).subscribe((doc: any) => {

        this.usersCount = doc.length



        const testsArray = doc.map((item: any) => item.tests);
        const nameArray = doc.map((item: any) => item.user_name);

        this.updateBarChartData(testsArray, nameArray)

      })




    }
    else {

      this.adminService.fetchVitalsDashboard(this.activeStatusValue).subscribe((doc: any) => {
        this.monthScan = doc.total_tests_this_month
        this.todayScan = doc.total_tests_today
        this.totalScan = doc.total_tests_till_now


      })
      this.adminService.fetchScansByMonth(this.year, this.activeStatusValue).subscribe((doc: any) => {

        this.monthlyScans = doc.total_tests_this_month
        this.updateLineChartData()
        this.lineChart = this.lineChartOptions


      })

      this.adminService.fetchScansOfOrg(this.startDate, this.todayDate, this.activeStatusValue).subscribe((doc: any) => {

        this.orgDetails = doc;
        const newObject = { org_name: 'All Organization', org_id: '' };

        // Add the new object to the beginning of the array
        this.orgDetails.unshift(newObject);



        const testsArray = doc.map((item: any) => item.tests);
        const nameArray = doc.map((item: any) => item.org_name);
        // this.OrgOptions = nameArray

        this.updateBarChartData(testsArray, nameArray)

      })
      this.adminService.fetchScansOfIndustry(this.startDate, this.todayDate, this.activeStatusValue).subscribe((doc: any) => {
        this.name_array = []

        const testsArray = doc.map((item: any) => item.response_percentage);
        this.testsArray = testsArray
        doc.forEach((element: any) => {
          const nameArray = this.industryArray.filter((item: any) => item.id == Number(element.industry_id));
          this.name_array.push(nameArray[0].industry)
        })

        this.updatePieChart(testsArray, this.name_array)

      })



    }



  }

  updateLineChartData() {

    if (this.lineChartOptions.data && this.lineChartOptions.data.datasets) {
      this.lineChartOptions.data.datasets[0].data = this.monthlyScans;
    }


  }
  updateBarChartData(test: any, name: any) {

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
    if (totalLabels > 5) {
      const newWidth = 450 + ((totalLabels - 5) * 70)
      containerBody.style.width = `${newWidth}px`


    }
  }

  updatePieChart(data: any, label: any) {
    this.pieChartOptions = {
      type: 'pie',
      data: {
        labels: label,
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
  checkDate(startDate: any, endDate: any) {
    if (new Date(endDate) < new Date(startDate)) endDate = startDate;
    this.startDate = startDate;
    this.todayDate = endDate;
    if (this.orglogin == true) {

      this.adminService.fetchScansOfUsers(this.snapshotParam, this.startDate, this.todayDate, this.activeStatusValue).subscribe((doc: any) => {

        this.usersCount = doc.length
        if (this.barChartOptions) {
          this.barChartOptions.destroy();
        }


        const testsArray = doc.map((item: any) => item.tests);
        const nameArray = doc.map((item: any) => item.user_name);


        this.updateBarChartData(testsArray, nameArray)

      })

    }
    else {

      this.adminService.fetchScansOfOrg(this.startDate, this.todayDate, this.activeStatusValue).subscribe((doc: any) => {
        if (this.barChartOptions) {
          this.barChartOptions.destroy();
        }

        const testsArray = doc.map((item: any) => item.tests);
        const nameArray = doc.map((item: any) => item.org_name);


        this.updateBarChartData(testsArray, nameArray)


      })
      this.adminService.fetchScansOfIndustry(this.startDate, this.todayDate, this.activeStatusValue).subscribe((doc: any) => {
        this.name_array = []
        const testsArray = doc.map((item: any) => item.response_percentage);
        this.testsArray = testsArray
        doc.forEach((element: any) => {
          const nameArray = this.industryArray.filter((item: any) => item.id == Number(element.industry_id));
          this.name_array.push(nameArray[0].industry)
        })



        this.updatePieChart(testsArray, this.name_array)
      })







    }
  }

  checVersionValue(event: any) {
    this.lineChart = [];

    this.activeStatusValue = event.value;

    if (this.orglogin == true) {
      this.adminService.fetchVitalsDashboardbyId(this.snapshotParam, this.activeStatusValue).subscribe((doc: any) => {
        this.monthScan = doc.total_tests_this_month
        this.todayScan = doc.total_tests_today
        this.totalScan = doc.total_tests_till_now

      })

      this.adminService.fetchScansByMonthByOrgId(this.year, this.snapshotParam, this.activeStatusValue).subscribe((doc: any) => {
        this.monthlyScans = doc.total_tests_this_month
        this.updateLineChartData()
        this.lineChart = this.lineChartOptions
      })

      this.adminService.fetchScansOfUsers(this.snapshotParam, this.startDate, this.todayDate, this.activeStatusValue).subscribe((doc: any) => {

        this.usersCount = doc.length
        if (this.barChartOptions) {
          this.barChartOptions.destroy();
        }



        const testsArray = doc.map((item: any) => item.tests);
        const nameArray = doc.map((item: any) => item.user_name);


        this.updateBarChartData(testsArray, nameArray)

      })





    }
    else {
      this.adminService.fetchVitalsDashboard(this.activeStatusValue).subscribe((doc: any) => {
        this.monthScan = doc.total_tests_this_month
        this.todayScan = doc.total_tests_today
        this.totalScan = doc.total_tests_till_now


      })
      this.adminService.fetchScansByMonth(this.year, this.activeStatusValue).subscribe((doc: any) => {
        this.monthlyScans = doc.total_tests_this_month
        this.updateLineChartData()
        this.lineChart = this.lineChartOptions


      })

      this.adminService.fetchScansOfOrg(this.startDate, this.todayDate, this.activeStatusValue).subscribe((doc: any) => {
        this.orgDetails = doc;
        const newObject = { org_name: 'All Organization', org_id: '' };

        // Add the new object to the beginning of the array
        this.orgDetails.unshift(newObject);
        if (this.barChartOptions) {
          this.barChartOptions.destroy();
        }


        const testsArray = doc.map((item: any) => item.tests);
        const nameArray = doc.map((item: any) => item.org_name);

        this.updateBarChartData(testsArray, nameArray)



      })
      this.adminService.fetchScansOfIndustry(this.startDate, this.todayDate, this.activeStatusValue).subscribe((doc: any) => {
        this.name_array = []
        const testsArray = doc.map((item: any) => item.response_percentage);
        this.testsArray = testsArray
        doc.forEach((element: any) => {
          const nameArray = this.industryArray.filter((item: any) => item.id == Number(element.industry_id));
          this.name_array.push(nameArray[0].industry)
        })

        this.updatePieChart(testsArray, this.name_array)

      })



    }
  }


}
