import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminConsoleService } from '../services/admin-console.service';
@Component({
  selector: 'app-vitals-dashboard',
  templateUrl: './vitals-dashboard.component.html',
  styleUrls: ['./vitals-dashboard.component.scss']
})
export class VitalsDashboardComponent implements OnInit {
  vitalsCount:any=0;
  activePilotsCount:any=0;
  vitalsDetails:any[]=[];
  totalTests:any=0;
  files: File[] = [];
  snapshotParam:any = "initial value";
  guestData:any=[];

  constructor(
    private readonly adminService: AdminConsoleService,
    private readonly route: ActivatedRoute,

    ) { }

  ngOnInit(): void {
    this.snapshotParam = this.route.snapshot.paramMap.get("id");
    this.route.params.subscribe((val:any) =>{
      this.guestData=[];
      this.snapshotParam = val.id;

      this.adminService.fetchVitalsCount(this.snapshotParam == '1' ? 'hsa':(this.snapshotParam == '2' ? 'vitals':'ruw') ).subscribe((doc:any) =>{
        if(this.snapshotParam==='1'){
          this.vitalsCount = doc.total_hsa_pilot_count;
        }else if(this.snapshotParam==='2'){
          this.vitalsCount = doc.total_vitals_pilot_count;
        }else {
          this.vitalsCount = doc.total_ruw_pilot_count;
          
        }
      });
      this.adminService.fetchActiveVitalsCount(this.snapshotParam == '1' ? 'hsa':(this.snapshotParam == '2' ? 'vitals':'ruw') ).subscribe((doc:any) =>{
        if(this.snapshotParam==='1'){
          this.activePilotsCount = doc.total_hsa_pilot_count;
        }else if(this.snapshotParam==='2'){
          this.activePilotsCount = doc.total_vitals_pilot_count;
        }else {
          this.activePilotsCount = doc.total_ruw_pilot_count;
          
        }
      });
      this.adminService.fetchTotalTestVitals(this.snapshotParam).subscribe((doc:any) =>{console.log('total test vitals',doc);this.totalTests=doc.total_tests});
      this.adminService.fetchLatestVitals(this.snapshotParam).subscribe((doc:any) =>{ this.vitalsDetails=doc.data});
      this.adminService.fetchGuests(this.snapshotParam,1,5).subscribe((doc:any)=>{   
      this.guestData = doc.data;
          
        })
    });
  }

  daysLefts(date:any){
    const firstDate = new Date();
    const secondDate = new Date(date);
    const total_seconds = Math.abs(secondDate.valueOf() - firstDate.valueOf()) / 1000;  
    const days_difference = Math.floor (total_seconds / (60 * 60 * 24)); 
    return days_difference;
  }


}
