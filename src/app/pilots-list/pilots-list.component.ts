import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminConsoleService } from '../services/admin-console.service';
import { AdvancedTableService } from '../shared/advanced-table/advanced-table.service';

@Component({
  selector: 'app-pilots-list',
  templateUrl: './pilots-list.component.html',
  styleUrls: ['./pilots-list.component.scss']
})
export class PilotsListComponent implements OnInit {

  page=1;
  vitalsDetails:any[]=[];
  vitalsDetailsActive:any[]=[];
  length:any
  pageSizeOptions: number[] = [10, 20,30,40,50,60,70,80,90,100];
  entries:any=this.pageSizeOptions[0]
  pagenumber:any=1;
  total_pages:any;
  total_org:any;
  snapshotParam:any = "initial value";
  currentPage:any;

  constructor(private readonly adminService: AdminConsoleService,public service: AdvancedTableService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.snapshotParam = this.route.snapshot.paramMap.get("id");

    this.route.params.subscribe((val:any)=>{
      this.snapshotParam = val.id;
      this.route.queryParams.subscribe((params:any)=>{
        if(params.status =='active'){
          this.adminService.fetchVitalsActiveByPage(this.snapshotParam,this.pagenumber,this.entries).subscribe((doc:any) =>{
          this.total_org=doc.total
          this.currentPage=doc.page
          this.total_pages=doc.total_pages
    
          this.vitalsDetails=doc.data;
          this.length=this.vitalsDetails.length
          this.vitalsDetails = doc.sort((a: { id: number; },b: { id: number; })=> b.id-a.id);
    
          return doc
        })
        }
        else{
          this.adminService.fetchVitalsByPage(this.snapshotParam,this.pagenumber,this.entries).subscribe((doc:any) =>{
          this.total_org=doc.total
          this.currentPage=doc.page
          this.total_pages=doc.total_pages

          this.vitalsDetails=doc.data;
          this.length=this.vitalsDetails.length
          this.vitalsDetails = doc.sort((a: { id: number; },b: { id: number; })=> b.id-a.id);
    
          return doc
        })
        }
      })
    })



  }


  loadPage(val:any){
    this.pagenumber=val

    this.route.queryParams.subscribe((params:any)=>{
      if(params.status =='active'){
        this.adminService.fetchVitalsActiveByPage(this.snapshotParam,this.pagenumber,this.entries).subscribe((doc:any) =>{
        this.total_org=doc.total
        this.currentPage=doc.page
        this.total_pages=doc.total_pages
  
        this.vitalsDetails=doc.data;
        this.length=this.vitalsDetails.length
        this.vitalsDetails = doc.sort((a: { id: number; },b: { id: number; })=> b.id-a.id);
        return doc})
      }
      else{
        this.adminService.fetchVitalsByPage(this.snapshotParam,this.pagenumber,this.entries).subscribe((doc:any) =>{
        this.total_org=doc.total
        this.currentPage=doc.page
        this.total_pages=doc.total_pages
  
        this.vitalsDetails=doc.data;
        this.length=this.vitalsDetails.length
        this.vitalsDetails = doc.sort((a: { id: number; },b: { id: number; })=> b.id-a.id);
  
        return doc})
      }
    })
         
  }

  onFilter (data:any) {
    this.entries=data.value
    this.route.queryParams.subscribe((params:any)=>{
      if(params.status =='active'){
        this.adminService.fetchVitalsActiveByPage(this.snapshotParam,this.pagenumber,this.entries).subscribe((doc:any) =>{
        this.total_org=doc.total
        this.currentPage=doc.page
        this.total_pages=doc.total_pages
  
        this.vitalsDetails=doc.data; 
        this.length=this.vitalsDetails.length
        this.vitalsDetails = doc.sort((a: { id: number; },b: { id: number; })=> b.id-a.id);
  
        return doc})
      }
      else{
        this.adminService.fetchVitalsByPage(this.snapshotParam,this.pagenumber,this.entries).subscribe((doc:any) =>{
        this.total_org=doc.total
        this.currentPage=doc.page
        this.total_pages=doc.total_pages
  
        this.vitalsDetails=doc.data;
        this.length=this.vitalsDetails.length
        this.vitalsDetails = doc.sort((a: { id: number; },b: { id: number; })=> b.id-a.id);
  
        return doc})
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
