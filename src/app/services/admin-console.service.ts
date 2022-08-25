import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminConsoleService {

  constructor(private readonly http: HttpClient) { }

  fetchOrganisationCount(){
    return this.http.get(`https://dev.services.fedo.health/sales/api/v1/vitals/org/count`).pipe(map(doc=>doc));
  }

  fetchVitalsCount(){
    return this.http.get(`https://dev.services.fedo.health/sales/api/v1/svitals/org/vitals_count`).pipe(map(doc=>doc));
  }
  
  fetchlatestOrg(){
    return this.http.get(`https://dev.services.fedo.health/sales/api/v1/vitals/org/latest`).pipe(map(doc=>{console.log('asqwe',doc);return doc}));
  }
  
  fetchActiveVitalsCount(){
    return this.http.get(`https://dev.services.fedo.health/sales/api/v1/vitals/org/active_vitals_count`).pipe(map(doc=>doc));
  }




}

