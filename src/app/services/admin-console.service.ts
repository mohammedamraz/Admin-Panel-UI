import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { API_URL } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class AdminConsoleService {

  constructor(private readonly http: HttpClient) { }

  fetchOrganisationCount(){
    return this.http.get(`${API_URL}org/count`);
  }

  fetchVitalsCount(){
    return this.http.get(`${API_URL}vitals_count`) ;
  }
  fetchActiveVitalsCount(){
    return this.http.get(`${API_URL}active_vitals_count`) ;
  }
  fetchLatestVitals(){
    return this.http.get(`${API_URL}latest`) ;
  }
  fetchTotalTestVitals(){
    return this.http.get(`${API_URL}/tests`) ;
  }
  fetchAllOrg(){
    return this.http.get(`${API_URL}/org`) ;
  }
   

  fetchLatestOrg(){
    return this.http.get(`${API_URL}org/latest`);
  }




}

