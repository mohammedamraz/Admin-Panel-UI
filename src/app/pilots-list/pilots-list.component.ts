import { Component, OnInit } from '@angular/core';
import { AdminConsoleService } from '../services/admin-console.service';

@Component({
  selector: 'app-pilots-list',
  templateUrl: './pilots-list.component.html',
  styleUrls: ['./pilots-list.component.scss']
})
export class PilotsListComponent implements OnInit {

  vitalsDetails:any[]=[];
  constructor(private readonly adminService: AdminConsoleService,) { }

  ngOnInit(): void {

    this.adminService.fetchLatestVitals().subscribe((doc:any) =>{console.log('dude,', doc);this.vitalsDetails=doc})

  }

}
