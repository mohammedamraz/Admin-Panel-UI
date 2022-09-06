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

	public httpLoading$ = new BehaviorSubject<boolean>(false);



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

  patchOrg(id:number,data:any){
    return this.http.patch(`${API_URL}org/${id}`,data);

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
    return this.http.post(`${API_ADMIN_URL}login`,{passcode:(Forge.util.encode64(base64Encrypted))})
    .pipe(
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

  //this is for the org login this is also should be used for the signuo confirm where login is using for the dashboard
  // orgUserAdmin(data:any){
  //   console.debug('UsersConsoleService/orgUserAdmin()')
  //   const publicKey = Forge.pki.publicKeyFromPem(PUBLIC_KEY);
  //   let base64Encrypted =  publicKey.encrypt(JSON.stringify(data),'RSA-OAEP');
  //   return this.http.post(`${API_URL}login/org`,{passcode:(Forge.util.encode64(base64Encrypted))})
  //   .pipe(
  //     catchError(err =>{throw new Error("")}),
  //     map((doc:any)=>{
  //       if(data.checkBox==true){
  //         localStorage.setItem("jwtToken",doc.jwtToken)
  //       }
  //       else sessionStorage.setItem("jwtToken",doc.jwtToken)
  //       return doc
  //     }))
  // }
  
  // forgetPassword(data:any){
    
  //   return this.http.post(`${API_URL}login/user`,data);
  // }
  
  fetchOrgData(data:any){
    
    return this.http.get(`${API_URL}org/${data.organization_name}/${data.organization_email}/${data.organization_mobile}`)
  }

  //this api service is calling but we have to use this api in the next button when user is calling
  fetchUserDataIfExists(data:any){
    
    return this.http.get(`${API_URL}users/${data.organization_email}/${data.organization_mobile}`)
  }
  
  //delete image logo from the organization db

  deleteImageLogoFromOrgDb(id:any){
    
    return this.http.delete(`${API_URL}org/logo/${id}`)
  }

  // update image url by id 
  updateImageLogoInOrgDb(id:any,file:any){
    
    return this.http.patch(`${API_URL}org/logo/${id}`,file)
  }


  // signup(data:any){
  //   console.debug('UsersConsoleService/signup()')
  //   const publicKey = Forge.pki.publicKeyFromPem(PUBLIC_KEY);
  //   let base64Encrypted =  publicKey.encrypt(JSON.stringify(data),'RSA-OAEP');

  //   return this.http.post(`${API_URL}signup/user`,{passcode:(Forge.util.encode64(base64Encrypted))})
  //   .pipe(
  //     catchError(err =>{throw new Error("")}),
  //     map((doc:any)=>{
        
  //       return doc
  //     }))
  // }

  signup(data:any){

    return this.http.post(`${API_URL}signup/user`,data);
  }

  // ConfirmSignup(data:any){
  //   console.debug('UsersConsoleService/ConfirmSignup()')
  //   const publicKey = Forge.pki.publicKeyFromPem(PUBLIC_KEY);
  //   let base64Encrypted =  publicKey.encrypt(JSON.stringify(data),'RSA-OAEP');

  //   return this.http.post(`${API_URL}confirm/signup`,{passcode:(Forge.util.encode64(base64Encrypted))})
  //   .pipe(
  //     catchError(err =>{throw new Error("")}),
  //     map((doc:any)=>{
        
  //       return doc
  //     }))
  // }

  ConfirmSignup(data:any){

    return this.http.post(`${API_URL}confirm/signup`,data);
  }

  // forgotPassword(data:any){
  //   console.debug('UsersConsoleService/forgotPassword()')
  //   const publicKey = Forge.pki.publicKeyFromPem(PUBLIC_KEY);
  //   let base64Encrypted =  publicKey.encrypt(JSON.stringify(data),'RSA-OAEP');

  //   return this.http.post(`${API_URL}password`,{passcode:(Forge.util.encode64(base64Encrypted))})
  //   .pipe(
  //     catchError(err =>{throw new Error("")}),
  //     map((doc:any)=>{
        
  //       return doc
  //     }))
  // }

  forgotPassword(data:any){

    return this.http.post(`${API_URL}password`,data);
  }

  // confirmPassword(data:any){
  //   console.debug('UsersConsoleService/confirmPassword()')
  //   const publicKey = Forge.pki.publicKeyFromPem(PUBLIC_KEY);
  //   let base64Encrypted =  publicKey.encrypt(JSON.stringify(data),'RSA-OAEP');

  //   return this.http.post(`${API_URL}password/otp`,{passcode:(Forge.util.encode64(base64Encrypted))})
  //   .pipe(
  //     catchError(err =>{throw new Error("")}),
  //     map((doc:any)=>{
        
  //       return doc
  //     }))
  // }

  confirmPassword(data:any){

    return this.http.post(`${API_URL}password/otp`,data);
  }







}

