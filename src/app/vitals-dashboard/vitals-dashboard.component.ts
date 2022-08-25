import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { AdminConsoleService } from '../services/admin-console.service';


interface PersonDetails {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
}

@Component({
  selector: 'app-vitals-dashboard',
  templateUrl: './vitals-dashboard.component.html',
  styleUrls: ['./vitals-dashboard.component.scss']
})
export class VitalsDashboardComponent implements OnInit {
  persons: PersonDetails[] = [];
  vitalsCount:any=0;
  activePilotsCount:any=0;

  constructor(private readonly adminService: AdminConsoleService,) { }

  ngOnInit(): void {

    this.adminService.fetchVitalsCount().pipe(map(doc =>{this.vitalsCount=doc;return doc}))
    this.adminService.fetchActiveVitalsCount().pipe(map(doc =>{this.activePilotsCount=doc;return doc}))

    
  this.persons = [
    {
      id: 1,
      firstName: 'Mark',
      lastName: 'Otto',
      userName: '@mdo'
    },
    {
      id: 2,
      firstName: 'Jacob',
      lastName: 'Thornton',
      userName: '@fat'
    },
    {
      id: 3,
      firstName: 'Larry',
      lastName: 'the Bird',
      userName: '@twitter'
    }
  ];
  }


}
