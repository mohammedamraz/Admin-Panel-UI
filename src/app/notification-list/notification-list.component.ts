import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private _route: ActivatedRoute,
    private router: Router,


  ) { }

  ngOnInit(): void {
    this._route.queryParams.subscribe((params:any) => {
      console.log('params => ',params)
      JSON.stringify(params) === '{}' ? null : [this.pagenumber= params.page, this.entries = params.entry , this.readStatusValue = params.status]
      console.log('hey mannu',params);
  this.adminService.fetchAllUnreadOrgByPage(this.pagenumber,this.entries,ACTIVE[this.readStatusValue]).subscribe((doc:any)=>{
    console.log("orglist",doc);
    this.page = this.pagenumber
    this.total_org=doc.total
    this.currentPage=doc.page
    this.total_pages=doc.total_pages

    this.tableData=doc.data;
    this.length=this.tableData.length

    // this.tableData = doc.sort((a: { id: number; },b: { id: number; })=> b.id-a.id);
      
    return doc
  });
    
    
  })
  }
  updateStatus(data:any,orgData:any){
    console.log("tabledata", this.tableData);
    const selected = this.tableData.findIndex((obj: { id: any; }) => obj.id === orgData.id);
    console.log("id", this.tableData[selected].is_deleted)
      this.tableData[selected].is_deleted = !data;
      
      this.adminService.patchOrgStatus(orgData.id, orgData , data).subscribe({
        next: (res) => {
          if(data) {
            const prod:any = orgData.product.map((el:any)=>{
              return {
                fedo_score:el.fedoscore,
                pilot_duration: el.pilot_duration,
                product_junction_id:el.id,
                product_id: el.product_id,
                web_access: el.web_access,
                web_url: el.web_access ? el.web_url :'',
                web_fedoscore: el.web_access ? el.web_fedoscore:false,
                event_mode: el.event_mode
              }
            });
  
            this.updatePilotDuration(orgData.id,data,prod);
  
            // this.adminService.sendEmailOnceOrgIsBackActive({organisation_admin_name:orgData.admin_name,organisation_admin_email:orgData.organization_email,email:orgData.organization_email}).subscribe({
            //   next: (res) =>{
            //   },
            //   error : (err)=>{
            //   }
            // })
          }
          else{
            const prod:any = orgData.product.map((el:any)=>{
              return {
                fedo_score:el.fedoscore,
                pilot_duration: el.pilot_duration-(this.daysLefts(el.end_date))<0 ? 0 : this.daysLefts(el.end_date)+1,
                product_junction_id:el.id,
                product_id: el.product_id,
                web_access: el.web_access,
                web_url: el.web_access ? el.web_url :'',
                web_fedoscore: el.web_access ? el.web_fedoscore:false,
                event_mode: el.event_mode
              }
            });
            this.updatePilotDuration(orgData.id,data,prod);
  
          }
          this.adminService.fetchAllUserOfOrgByPage(orgData.id,1,10000,'').subscribe((doc:any)=>{
            doc.data.map((el:any)=>{
              const user_id=el.id
              this.adminService.patchUserStatus(el.id, data).subscribe({
                next: (res) => {
               console.debug(res)
                },
                error:(err)=>{
                  console.debug(err)
                }
                
              })
              
  
              
            })
            
            
          })
          // this.reloadCurrentPage();
        },
      })
    
    

  }
  updatePilotDuration(id:any, data:any,prod:any){
    let datachunk = new FormData();
    datachunk.append('pilot_duration',prod.map((value:any) => value.pilot_duration).toString());

    datachunk.append('fedo_score',prod.map((value:any) => value.fedo_score).toString());
    datachunk.append('product_junction_id',prod.filter(((value:any)=> value.product_junction_id == '' ? false : true)).map((value:any) => value.product_junction_id).toString());
    datachunk.append('product_id',prod.map((value:any) => value.product_id).toString());
    datachunk.append('productaccess_web',prod.map((value:any) => value.web_access).toString());
    datachunk.append('web_url',prod.map((value:any) => value.web_url).toString());
    datachunk.append('web_fedoscore',prod.map((value:any) => value.web_fedoscore).toString());
    datachunk.append('event_mode',prod.map((value:any) => value.event_mode).toString());

    this.adminService.patchOrgDetails(id, datachunk).subscribe({
      next: (res) => {
        console.log('the success=>',res);

      },
      error: (err) => {
        console.log('the failure=>',err);

      },
      complete: () => { }
    });
  }
  daysLefts(date:any){
    const firstDate = new Date();
    const secondDate = new Date(date);
    const total_seconds = Math.abs(secondDate.valueOf() - firstDate.valueOf()) / 1000;  
    const days_difference = Math.floor (total_seconds / (60 * 60 * 24)); 
    return days_difference;
  }

  ngOnDestroy(){
    this.markAllAsRead();
  }

  fetchOgrlist(){
    this.adminService.fetchAllUnreadOrgByPage(this.pagenumber,this.entries,ACTIVE[this.readStatusValue]).subscribe((doc:any)=>{
      this.page = this.pagenumber
      console.log("pagesssssssssssssssssssssssssssssssss",this.page);
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
    this.router.navigate([], {
      queryParams: {
        page: this.pagenumber,
        status : this.readStatusValue,
        entry : this.entries
      },
    }); 
    this.fetchOgrlist()
  }
  loadPage(val:any){
    console.log('loadpage',);
    this.pagenumber=val;
    this.router.navigate([], {
      queryParams: {
        page: this.pagenumber,
        status : this.readStatusValue,
        entry : this.entries
      },
      
    }); 
    this.fetchOgrlist()
    

  }
  onReadStatus(data:any){
    console.log('read status',data.value);
    this.readStatusValue=data.value
    this.router.navigate([], {
      queryParams: {
        page: this.pagenumber,
        status : this.readStatusValue,
        entry : this.entries
      },
    }); 
    
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
