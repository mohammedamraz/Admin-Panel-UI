import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminConsoleService } from '../services/admin-console.service';

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

  pageSizeOptions: number[] = [5, 10, 20];
  
  entries:any=this.pageSizeOptions[1]
  pagenumber:any=1;
  total_pages:any;
  total_org:any;
  
  currentPage:any;
  // tabDAta:any[]=[];
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



    this.route.queryParams.subscribe((params:any)=>{
      if(params.status =='active'){
        this.adminService.fetchVitalsActiveByPage(this.pagenumber,this.entries).subscribe((doc:any) =>{console.log('dude,', doc);
        this.total_org=doc.total
        this.currentPage=doc.page
        this.total_pages=doc.total_pages
  
        // console.log('doc.......................',doc.data)
        this.vitalsDetails=doc.data; console.log('you are the one ', this.vitalsDetails)
        this.length=this.vitalsDetails.length
        console.log("hello00000",this.length);
        this.vitalsDetails = doc.sort((a: { id: number; },b: { id: number; })=> b.id-a.id);
        // this.length=this.tabDAta.length
        // console.log("hello00000",this.length);
  
        return doc})
      }
      else{
        this.adminService.fetchVitalsByPage(this.pagenumber,this.entries).subscribe((doc:any) =>{console.log('dude,', doc);
        this.total_org=doc.total
        this.currentPage=doc.page
        this.total_pages=doc.total_pages
  
        // console.log('doc.......................',doc.data)
        this.vitalsDetails=doc.data; console.log('you are the one ', this.vitalsDetails)
        this.length=this.vitalsDetails.length
        console.log("hello00000",this.length);
        this.vitalsDetails = doc.sort((a: { id: number; },b: { id: number; })=> b.id-a.id);
        // this.length=this.tabDAta.length
        // console.log("hello00000",this.length);
  
        return doc})
      }
    })



  }


  loadPage(val:any){
    this.pagenumber=val
    // console.log("fjhgvjgfjd",this.pagenumber);
    // console.log("entries",this.entries);

    this.adminService.fetchAllOrgByPage(this.pagenumber,this.entries).subscribe
    ((doc:any) =>{ 
      this.total_org=doc.total
      this.total_pages=doc.total_pages
      this.currentPage=doc.page
      // console.log('doc.......................',doc)
      this.vitalsDetails=doc.data
      
      // this.tabDAta = doc.sort((a: { id: number; },b: { id: number; })=> b.id-a.id);
      this.length=this.vitalsDetails.length
     
      return doc});
      // this.columns = this.tabDAta;
      // console.log("heloooo",this.tabDAta);
      // this.onFilter(this.item)
     
      
      
      
    
  }

  onFilter (data:any) {
      this.entries=data.value
      
      // console.log("jhgfdhfh",this.entries);
      // console.log("page number",this.pagenumber)

      this.adminService.fetchAllOrgByPage(this.pagenumber,this.entries).subscribe
    ((doc:any) =>{ 
      this.total_pages=doc.total_pages
      this.currentPage=doc.page
      this.total_org=doc.total
      // console.log('doc.......................',doc)
      this.vitalsDetails=doc.data; console.log('you are the one ', this.vitalsDetails)
      this.length=this.vitalsDetails.length
      // console.log("hello00000",this.length);
      this.vitalsDetails = doc.sort((a: { id: number; },b: { id: number; })=> b.id-a.id);
      // this.length=this.tabDAta.length
      // console.log("hello00000",this.length);
      
      return doc});

    //  return data.value
     
      
  }








  daysLefts(date:any){
    const firstDate = new Date();
    const secondDate = new Date(date);
    const total_seconds = Math.abs(secondDate.valueOf() - firstDate.valueOf()) / 1000;  
    const days_difference = Math.floor (total_seconds / (60 * 60 * 24)); 
    return days_difference;
  }

}
