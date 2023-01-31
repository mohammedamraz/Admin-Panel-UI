import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminConsoleService } from '../services/admin-console.service';


@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {
  pageSizeOptions: number[] = [10, 20,30,40,50,60,70,80,90,100];
  entries:any=this.pageSizeOptions[0]
  page = 1;
  currentPage:any;
  total_org:any;
  total_pages:any
  tableData:any=[]
  created_date:any=''
  todayDate=new Date()
  readStatusOptions:any=['Unread','Read']
  readStatusValue:any=this.readStatusOptions[0]
  pagenumber:any=1
  length:any;




  constructor(
    private readonly adminService: AdminConsoleService,
  ) { }

  ngOnInit(): void {
  this.adminService.fetchAllUnreadOrgByPage(this.pagenumber,this.entries,ACTIVE[this.readStatusValue]).subscribe((doc:any)=>{
    console.log("orglist",doc);
    this.total_org=doc.total
    this.currentPage=doc.page
    this.total_pages=doc.total_pages

    this.tableData=doc.data;
    this.length=this.tableData.length

    // this.tableData = doc.sort((a: { id: number; },b: { id: number; })=> b.id-a.id);
      
    return doc
    
    
  })
  }

  ngOnDestroy(){
    this.markAllAsRead();
  }

  fetchOgrlist(){
    this.adminService.fetchAllUnreadOrgByPage(this.pagenumber,this.entries,ACTIVE[this.readStatusValue]).subscribe((doc:any)=>{
      console.log("orglist",doc);
      this.total_org=doc.total
      this.currentPage=doc.page
      this.total_pages=doc.total_pages
  
      this.tableData=doc.data;
      this.length=this.tableData.length
  
      // this.tableData = doc.sort((a: { id: number; },b: { id: number; })=> b.id-a.id);
        
      return doc},(err:any)=>{
        this.tableData = [];
    });

    if(this.readStatusValue == 'Read'){
      this.markAllAsRead();
  }


  }
  onFilter(data:any){
    this.entries=data.value
    this.fetchOgrlist()
  }
  loadPage(val:any){
    console.log('loadpage',val);
    this.pagenumber=val;
    this.fetchOgrlist()
    

  }
  onReadStatus(data:any){
    console.log('read status',data.value);
    this.readStatusValue=data.value
    this.fetchOgrlist()
  }

  markAllAsRead(){
    this.adminService.fetchAllUnreadOrgByPage(1,1000000,false).subscribe((doc:any)=>{
      console.log("orglist",doc);
      doc.data.map((doc:any)=>{
        console.log("doc",doc)
        // const v = Object.assign(doc, {vitalsTest:2})
        this.updateReadStatus(doc.id)
      }
      )
    })
    
  }

  updateReadStatus(id : any){
    if(this.readStatusValue == 'Unread'){
      this.tableData = this.tableData.filter((obj: { id: any; }) => obj.id != id);      
    }
    console.log("inside update status")
    this.adminService.updateReadStatus(id).subscribe({
      next : (doc) =>{
        console.log("doc",doc)
      },
      error : (err) =>{
        console.log
      }
    })
  
}
}

  export const ACTIVE: any = {
    'Read': 'true',
    'Unread': 'false',
  }
