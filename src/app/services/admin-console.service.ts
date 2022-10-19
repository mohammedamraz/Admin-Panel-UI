import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, } from 'rxjs';
import { ADMIN_URL, API_URL } from '../constants';
import { NavigationEnd, NavigationError, NavigationStart, Event } from '@angular/router';
import { AuthenticationService } from '../core/service/auth.service';
@Injectable({
  providedIn: 'root'
})
export class AdminConsoleService {

  constructor(
    private readonly http: HttpClient,    
    private authService: AuthenticationService,
    ) { }

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
  
  fetchVitals(){
    return this.http.get(`${API_URL}2`) ;
  }

  fetchVitalsActive(){
    return this.http.get(`${API_URL}2?type=active`) ;
  }

  fetchTotalTestVitals(){
    return this.http.get(`${API_URL}tests/2`) ;
  }
  fetchAllOrg(){
    return this.http.get(`${API_URL}/org`) ;
  }

  fetchAllActiveOrg(){
    return this.http.get(`${API_URL}/org?type=active`) ;
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
    
    data.organization_mobile='+91'+data.organization_mobile
    return this.http.patch(`${API_URL}org/${id}`,data);

  }

  patchOrgStatus(id:number,data:any){

    
    return this.http.patch(`${API_URL}org/${id}`,{is_deleted:!data});

  }

  patchUserStatus(id:number,data:any){

    
    return this.http.patch(`${API_URL}users/${id}`,{is_deleted:!data});

  }

  patchOrgDetails(id:number,data:any){
    
    return this.http.patch(`${API_URL}${id}`,data);

  }
   
  fetchUserListById(id:number){
    return this.http.get(`${API_URL}users/data/list/${id}`);
  }

  fetchLatestOrg(){
    return this.http.get(`${API_URL}org?type=latest`);
  }
  fetchAllUserOfOrg(id:string){
    return this.http.get(`${API_URL}users/${id}`);
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

   

    return this.http.get(`${API_URL}users/${data.email}/${data.mobile}`)

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
  fetchAllOrgByPage(num:any,item:any,is_deleted:any){
    
    return this.http.get(`${API_URL}/org?page=${num}&per_page=${item}&is_deleted=${is_deleted}`)   
  }
  fetchAllUserOfOrgByPage(id:string,num:any,item:any,is_deleted:any){
    return this.http.get(`${API_URL}users/${id}?page=${num}&per_page=${item}&is_deleted=${is_deleted}`);
  }

  fetchVitalsByPage(num:any,item:any){
    return this.http.get(`${API_URL}2?page=${num}&per_page=${item}`) ;
  }

  fetchVitalsActiveByPage(num:any,item:any){
    return this.http.get(`${API_URL}2?type=active&page=${num}&per_page=${item}`) ;
  }

  sendEmailOnceOrgIsCreated(content:any){

    return this.http.post(`${ADMIN_URL}notification/signup/org/email`,content);
  }

  sendEmailOnceUserIsCreated(content:any){

    return this.http.post(`${ADMIN_URL}notification/signup/user/email`,content);
      }





  breadcrumbs(event:any){
    let name ='';
    const loggedInUser = <any>this.authService.currentUser();
    // let name = loggedInUser.org_data[0].organization_name;

    if(event.url == '/vitals-dashboard'){
      this.breadCrumbs.next([
        { label: 'Vitals Dashboard', path: '/vitals-dashboard', active:true },
    ])
    }
    if(event.url == '/vitalsList'){
      this.breadCrumbs.next([
        { label: 'Vitals Dashboard', path: '/vitals-dashboard' },
        { label: 'Pilots List', path: '/vitalsList', active:true },
    ])
    }
    
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
    if(event.url?.startsWith('/orgdetails')){
      this.fetchOrgById(event.url.slice(12,)).subscribe({
        next: (res:any) => {
          name=res[0].organization_name
          this.breadCrumbs.next([
            { label: 'Home', path: 'home' },
            { label: 'Organisations List', path: 'orgList' },
            { label: name, path: `/orgdetails/${event.url.slice(12,)}`, active: true },
        ])
        },
      });

    }
    if(event.url?.startsWith('/userdetails')){
      this.fetchOrgById(event.url.slice(12,)).subscribe({
        next: (res:any) => {        
           name=res[0].organization_name
          this.breadCrumbs.next([
            { label: 'Home', path: 'home' },
            { label: 'Organisations List', path: 'orgList' },
            { label: name, path: `/orgdetails/${event.url.slice(13,)}`},
            { label: 'Users List', path: `/userdetails/${event.url.slice(13,)}`, active: true },
        ])
        },
      });

    }

    if(event.url?.slice(3,)=='/dashboard'){
      this.breadCrumbs.next([
        { label: 'Home', path: `${event.url.split('/')[1]}/dashboard`, active: true},
    ])
    }

    if(event.url?.slice(3,)=='/userdetails'){
      this.breadCrumbs.next([
        { label: 'Home', path: `${event.url.split('/')[1]}/dashboard`},
        { label: 'Users List', path: `${event.url.split('/')[1]}/userdetails`, active: true},
    ])
    }

    if(event.url?.split('/')[2]=='pilotdashboard'){
      this.breadCrumbs.next([
        { label: 'Home', path: `${event.url.split('/')[1]}/dashboard`},
        { label: `${event.url.split('/')[3] == '1' ? 'HSA' : (event.url.split('/')[3] === '2' ? 'Vitals':'RUW' )} Pilot`, path: `${event.url.split('/')[1]}/pilotdashboard/${event.url.split('/')[3]}`, active: true},
    ])
    }


  }

  fetchProducts(){

    return this.http.get(`${ADMIN_URL}product`);
  }

  fetchTpa(org_id:any){

    return this.http.get(`${ADMIN_URL}/tpa/list/${org_id}`);
  }
  addTpa(data:any){

    return this.http.post(`${ADMIN_URL}/tpa`,data);
  }
  
  sendEmailForVitalsWebAccess(data:any){
    
    return this.http.post(`${ADMIN_URL}notification/org/webAccess`,data);
  }
  
  fetchScan(orgId:any,prodId:any){
    
    return this.http.get(`${ADMIN_URL}junction/tests?org_id=${orgId}&product_id=${prodId}`);
  }

  fetchUserScan(userId:any,prodId:any){
    
    return this.http.get(`${ADMIN_URL}junction/tests?user_id=${userId}&product_id=${prodId}`);
  }
  
  fetchUserProdById(userId:any){
    
    return this.http.get(`${API_URL}users/data/product/list/${userId}`);
    }

    fetchLatestUserOfOrgProd(orgId:any, prodId:any){

      return this.http.get(`${API_URL}users/${orgId}?product_id=${prodId}&per_page=5`)
      // return this.http.get(`${ADMIN_URL}junction/tests?org_id=${orgId}&product_id=${prodId}`);
    }



}

