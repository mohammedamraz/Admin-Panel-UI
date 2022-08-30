import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, ReplaySubject } from 'rxjs';
import { API_ADMIN_URL, API_URL } from '../constants';
import { PUBLIC_KEY } from '../constants/keys';
import * as Forge from 'node-forge';


@Injectable({
  providedIn: 'root'
})
export class AdminConsoleService {

  constructor(private readonly http: HttpClient) { }

	public httpLoading$ = new BehaviorSubject<boolean>(true);



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
  createOrg(data:any){
    return this.http.post(`${API_URL}org`,data) ;
  }
  fetchOrgById(id:number){
    return this.http.get(`${API_URL}org/${id}`);
  }
  createUser(data:any){
      data.mobile='+91'+data.mobile;
    return this.http.post(`${API_URL}users`,data) ;
  }
   

  fetchLatestOrg(){
    return this.http.get(`${API_URL}org/latest`);
  }
  fetchAllUserOfOrg(id:string){
    return this.http.get(`${API_URL}vitals_users/${id}/7162583468123`);
  }

  loginAdmin(formData: any) {

    console.debug('UsersConsoleService/loginAdmin()')
    const publicKey = Forge.pki.publicKeyFromPem(PUBLIC_KEY);
    let base64Encrypted =  publicKey.encrypt(JSON.stringify(formData),'RSA-OAEP');
    return this.http.post(`${API_ADMIN_URL}login`,{passcode:(Forge.util.encode64(base64Encrypted))}).pipe(
      catchError(err =>{throw new Error("")}),
      map((doc:any)=>{
        if(formData.checkBox==true){
          localStorage.setItem("jwtToken",doc.jwtToken)
        }
        else sessionStorage.setItem("jwtToken",doc.jwtToken)
        return doc
      }))
  }

  orgAdmin(data:any){
    return this.http.post(`${API_URL}login/user`,data);
  }




}

