import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminConsoleService } from '../services/admin-console.service';

@Component({
  selector: 'app-pilots-list',
  templateUrl: './pilots-list.component.html',
  styleUrls: ['./pilots-list.component.scss']
})
export class PilotsListComponent implements OnInit {

  vitalsDetails:any[]=[];
  vitalsDetailsActive:any[]=[];
  constructor(private readonly adminService: AdminConsoleService,    private route: ActivatedRoute) { }

  ngOnInit(): void {


    this.route.queryParams.subscribe((params:any)=>{
      if(params.status =='active'){
        this.adminService.fetchVitalsActive().subscribe((doc:any) =>{console.log('dude,', doc);
        this.vitalsDetails=doc.sort((a: { id: number; },b: { id: number; })=> b.id-a.id)})
      }
      else{
        this.adminService.fetchVitals().subscribe((doc:any) =>{console.log('dude,', doc);
        this.vitalsDetails= doc.sort((a: { id: number; },b: { id: number; })=> b.id-a.id)})
      }
    })



  }

  daysLefts(date:any){
    const firstDate = new Date();
    const secondDate = new Date(date);
    const total_seconds = Math.abs(secondDate.valueOf() - firstDate.valueOf()) / 1000;  
    const days_difference = Math.floor (total_seconds / (60 * 60 * 24)); 
    return days_difference;
  }

}
