import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, } from 'rxjs';
import { ADMIN_URL, API_URL } from '../constants';
import { NavigationEnd, NavigationError, NavigationStart, Event } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AdminConsoleService {

  constructor(private readonly http: HttpClient) { }

	public httpLoading$ = new BehaviorSubject<boolean>(false);
	public breadCrumbs = new BehaviorSubject<any[]>([]);

  fetchOrganisationCount(){
    return this.http.get(`${API_URL}org/count`);
  }

  fetchVitalsCount(){
    return this.http.get(`${API_URL}count?product=vitals`) ;
  }
  fetchActiveVitalsCount(){
    return this.http.get(`${API_URL}count?product=vitals&status=active`) ;
  }
  fetchLatestVitals(){
    return this.http.get(`${API_URL}2?type=latest`) ;
  }
  fetchTotalTestVitals(){
    return this.http.get(`${API_URL}tests/2`) ;
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

  fetchUserById(id:number){
    return this.http.get(`${API_URL}users/${id}`);
  }
  createUser(data:any){
      data.mobile='+91'+data.mobile;
    return this.http.post(`${API_URL}users`,data) ;
  }

  patchOrg(id:number,data:any){
    return this.http.patch(`${API_URL}org/${id}`,data);

  }
   

  fetchLatestOrg(){
    return this.http.get(`${API_URL}org?type=latest`);
  }
  fetchAllUserOfOrg(id:string){
    return this.http.get(`${API_URL}vitals_users/${id}/1`);
  }

  fetchLatestUserOfOrg(id:string){
    return this.http.get(`${API_URL}users/${id}?type=latest`);
  }

  loginAdmin(formData: any) {

    console.debug('UsersConsoleService/loginAdmin()')
    return this.http.post(`${API_URL}login/org`,formData)
  }

  orgAdmin(data:any){
    return this.http.post(`${API_URL}login/user`,data);
  }

  
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

  signup(data:any){

    return this.http.post(`${API_URL}signup/user`,data);
  }


  ConfirmSignup(data:any){

    return this.http.post(`${API_URL}confirm/signup`,data);
  }

  
  forgotPassword(data:any){

    return this.http.post(`${API_URL}password`,data);
  }



  confirmPassword(data:any){

    return this.http.post(`${API_URL}password/otp`,data);
  }
  
  updateRegister(id:any){
    
    return this.http.patch(`${API_URL}org/register/status/${id}`,{});
  }
  
  updateUserRegister(id:any){
    
    return this.http.patch(`${API_URL}user/register/status/${id}`,{});

  }




  breadcrumbs(event:any){
    
    if(event.url == '/home'){
      this.breadCrumbs.next([
        { label: 'Home', path: 'home',active: true},
      ])
    }
    if(event.url == '/orgList'){
      this.breadCrumbs.next([
          { label: 'Home', path: 'home' },
          { label: 'Organisations List', path: 'orgList', active: true },
      ])
    }
    if(event.url.startsWith('/orgdetails')){
      this.breadCrumbs.next([
          { label: 'Home', path: 'home' },
          { label: 'Organisations List', path: 'orgList' },
          { label: event.url.slice(12,), path: `/orgdetails/${event.url.slice(12,)}`, active: true },
      ])
    }
    if(event.url.startsWith('/userdetails')){
      this.breadCrumbs.next([
          { label: 'Home', path: 'home' },
          { label: 'Organisations List', path: 'orgList' },
          { label: event.url.slice(13,), path: `/orgdetails/${event.url.slice(13,)}`},
          { label: 'Users List', path: `/userdetails/${event.url.slice(13,)}`, active: true },
      ])
    }

    if(event.url == '/vitals-dashboard'){
      this.breadCrumbs.next([
        { label: 'Vitals Dashboard', path: '/vitals-dashboard', active:true },
    ])
    }

  }

  fetchProducts(){

    return this.http.get(`${ADMIN_URL}product`);
  }





}

