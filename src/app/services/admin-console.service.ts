import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, } from 'rxjs';
import { ADMIN_URL, API_PRODUCTS_TESTS, API_URL } from '../constants';
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

  fetchUnreadOrganisationCount(){
    return this.http.get(`${API_URL}org/count?is_web=true`);
  }

  fetchVitalsCount(productName:any){
    return this.http.get(`${API_URL}count?product=${productName}`) ;
  }
  fetchActiveVitalsCount(productName:any){
    return this.http.get(`${API_URL}count?product=${productName}&status=active`) ;
  }
  fetchLatestVitals(id:any){
    return this.http.get(`${API_URL}${id}?type=latest`) ;
  }
  
  fetchVitals(){
    return this.http.get(`${API_URL}2`) ;
  }

  fetchVitalsActive(){
    return this.http.get(`${API_URL}2?type=active`) ;
  }

  fetchTotalTestVitals(id:any){
    return this.http.get(`${API_URL}tests/${id}`) ;
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

  createOrgDirect(data:any){
    return this.http.post(`${API_URL}org/direct`,data) ;
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

  createUserDirect(data:any){
    data.mobile='+91'+data.mobile;
  return this.http.post(`${API_URL}users/direct`,data) ;
}

  patchOrg(id:number,data:any){
    
    data.organization_mobile='+91'+data.organization_mobile
    return this.http.patch(`${API_URL}org/${id}`,data);

  }

  patchOrgStatus(id:number, orgData : any , data:any){

    
    return this.http.patch(`${API_URL}org/${id}`,{is_deleted:!data, organization_mobile : orgData.organization_mobile , admin_name : orgData.admin_name});

  }

  patchUserStatus(id:number,data:any){

    
    return this.http.patch(`${API_URL}users/${id}`,{is_deleted:!data});

  }

  patchuser(id:number,data:any){

    return this.http.patch(`${API_URL}users/${id}`, data);
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

  updateReadStatus(id:any){
    
    return this.http.patch(`${API_URL}org/register/status/${id}?is_web=true`,{});
  }
  
  updateUserRegister(id:any){
    
    return this.http.patch(`${API_URL}user/register/status/${id}`,{});

  }
  fetchAllOrgByPage(num:any,item:any,is_deleted:any){
    
    return this.http.get(`${API_URL}/org?page=${num}&per_page=${item}&is_deleted=${is_deleted}`)   
  }

  fetchAllOrgByName(num:any,item:any,name:any){
    
    return this.http.get(`${API_URL}/org?page=${num}&per_page=${item}&name=${name}`)   
  }

  fetchAllUnreadOrgByPage(num:any,item:any,is_read:any){
    
    return this.http.get(`${API_URL}/org?page=${num}&per_page=${item}&is_read=${is_read}&is_web=true`)   
  }

  fetchAllUserOfOrgByPage(id:string,num:any,item:any,is_deleted:any){
    return this.http.get(`${API_URL}users/${id}?page=${num}&per_page=${item}&is_deleted=${is_deleted}`);
  }
  
  fetchAllUserOfOrgByName(id:string,num:any,item:any,name:any){
    return this.http.get(`${API_URL}users/${id}?page=${num}&per_page=${item}&name=${name}`);
  }

  fetchVitalsByPage(id:any,num:any,item:any){
    return this.http.get(`${API_URL}${id}?page=${num}&per_page=${item}`) ;
  }

  fetchVitalsActiveByPage(id:any,num:any,item:any, status :any){
    return this.http.get(`${API_URL}${id}?type=${status}&page=${num}&per_page=${item}`) ;
  }
  sendEmailNotification(data:any){  
    return this.http.post(`${ADMIN_URL}notification/logout/notification`,data);
  }

  sendInactiveOrgEmailNotification(data:any){  
    return this.http.post(`${ADMIN_URL}notification/logout/inactive/notification`,data);
  }

  sendEmailOnceOrgIsCreated(content:any){

    return this.http.post(`${ADMIN_URL}notification/signup/org/email`,content);
  }

  sendEmailOnceUserIsCreated(content:any){

    return this.http.post(`${ADMIN_URL}notification/signup/user/email`,content);
      }

  ResendInvitationMailForOrg(content:any){
    
    return this.http.post(`${ADMIN_URL}notification/resend/email/org`,content);
      }

  ResendInvitationMailForUser(content:any){
    
    return this.http.post(`${ADMIN_URL}notification/resend/email/user`,content);
      }

  sendEmailOnceUserIsBackActive(content:any){
    
    return this.http.post(`${ADMIN_URL}notification/email/user/active`,content);
  }

  sendEmailOnceOrgIsBackActive(content:any){
    
    return this.http.post(`${ADMIN_URL}notification/email/org/active`,content);
  }
  fetchLocation(zip:any){
    return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&sensor=false&key=AIzaSyDKbpzwKSDDnYNgwnddnd0CLaKTa6bANWc`)
  }



  fetchVitalsDashboard(version_id:any){
    if(version_id != '') return this.http.get(`${ADMIN_URL}product_tests/tests/admin/board?product_id=${2}&version_id=${version_id}`);
    else return this.http.get(`${ADMIN_URL}product_tests/tests/admin/board?product_id=${2}`);
  }
  
  fetchVitalsDashboardbyId(id:any , version_id : any){
    console.log("version id ion the admin",version_id)
    if(version_id != '') return this.http.get(`${ADMIN_URL}product_tests/tests/admin/board?org_id=${id}&product_id=${2}&version_id=${version_id}`);
    else return this.http.get(`${ADMIN_URL}product_tests/tests/admin/board?org_id=${id}&product_id=${2}`);
  }

  fetchScansByMonth(year:any , version_id : any){
    console.log("version id ion the admin",version_id)
    if(version_id != '')    return this.http.get(`${ADMIN_URL}product_tests/tests/admin/board/year?test_date=${year}&product_id=${2}&version_id=${version_id}`); 
    else return this.http.get(`${ADMIN_URL}product_tests/tests/admin/board/year?test_date=${year}&product_id=${2}`); 
  }

  fetchScansByMonthByOrgId(year:any,id:any , version_id : any){
    console.log("version id ion the admin",version_id)
    if(version_id != '')  return this.http.get(`${ADMIN_URL}product_tests/tests/admin/board/year?test_date=${year}&product_id=${2}&org_id=${id}&version_id=${version_id}`); 
    else return this.http.get(`${ADMIN_URL}product_tests/tests/admin/board/year?test_date=${year}&product_id=${2}&org_id=${id}`); 
  }
  fetchScansOfOrg(firstDate:any,secondDate:any , version_id : any){
    if(version_id != '')  return this.http.get(`${ADMIN_URL}product_tests/tests/admin/board/filterperiod/org?product_id=${2}&test_date=${firstDate}&test_end_date=${secondDate}&version_id=${version_id}`)
    else return this.http.get(`${ADMIN_URL}product_tests/tests/admin/board/filterperiod/org?product_id=${2}&test_date=${firstDate}&test_end_date=${secondDate}`)
  }
  fetchScansOfIndustry(firstDate : any , secondDate :any ,version_id : any){
    if(version_id != '') return this.http.get(`${ADMIN_URL}product_tests/tests/admin/board/filterperiod/industry?product_id=${2}&test_date=${firstDate}&test_end_date=${secondDate}&version_id=${version_id}`)
    else return this.http.get(`${ADMIN_URL}product_tests/tests/admin/board/filterperiod/industry?product_id=${2}&test_date=${firstDate}&test_end_date=${secondDate}`)
  }
  fetchScansOfUsers(id:any,firstDate:any,secondDate:any, version_id : any){
    if(version_id != '') return this.http.get(`${ADMIN_URL}product_tests/tests/admin/board/filterperiod/user?org_id=${id}&product_id=${2}&test_date=${firstDate}&test_end_date=${secondDate}&version_id=${version_id}`)
    else return this.http.get(`${ADMIN_URL}product_tests/tests/admin/board/filterperiod/user?org_id=${id}&product_id=${2}&test_date=${firstDate}&test_end_date=${secondDate}`)
  }
  fetchVersions(){
    return this.http.get(`${ADMIN_URL}app_version`)
  }
  fetchIndustry(){
    return this.http.get(`${ADMIN_URL}industry_type`)
  }





  breadcrumbs(event:any){
    let name ='';
    const loggedInUser = <any>this.authService.currentUser();

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

    if(event.url == '/admin-dashboard'){
      this.breadCrumbs.next([
        { label: 'Home', path: 'home'},
        { label: 'Dashboard', path: 'admin-dashboard',active: true},
      ])
    }

    if(event.url?.split('?')[0] == '/orgList'){
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
            { label: name, path: `/orgdetails/${event.url.slice(13,).split('?')[0]}`},
            { label: 'Users List', path: `/userdetails/${event.url.slice(13,)}`, active: true },
        ])
        },
      });

    }

    if(event.url?.split('/')[2]=='dashboard'){
      this.breadCrumbs.next([
        { label: 'Home', path: `${event.url.split('/')[1]}/dashboard`, active: true},
    ])
    }

    if(event.url?.split('/')[2]=='admin-dashboard'){
      this.breadCrumbs.next([
        { label: 'Home', path: `${event.url.split('/')[1]}/dashboard`},
        { label: 'Dashboard', path: `${event.url.split('/')[1]}/admin-dashboard`, active: true},
    ])
    }

    if(event.url?.slice(3,).split('?')[0]=='/userdetails'){
      this.breadCrumbs.next([
        { label: 'Home', path: `${event.url.split('/')[1]}/dashboard`},
        { label: 'Users List', path: `${event.url.split('/')[1]}/userdetails`, active: true},
    ])
    }

    if(event.url?.split('/')[2]=='pilotdashboard'){
      if(loggedInUser.hasOwnProperty('org_data') && loggedInUser.org_data[0].type !== 'admin'){
        //orgAdmin
      this.breadCrumbs.next([
        { label: 'Home', path: `${event.url.split('/')[1]}/dashboard`},
        { label: `${event.url.split('/')[3] == '1' ? 'HSA' : (event.url.split('/')[3] === '2' ? 'Vitals':'RUW' )} Dashboard`, path: `${event.url.split('/')[1]}/pilotdashboard/${event.url.split('/')[3]}`, active: true},
      ])
    }
    if(loggedInUser.hasOwnProperty('org_data') && loggedInUser.org_data[0].type == 'admin'){
      //superadmin
      console.log('hi super user',event.url)
      this.fetchOrgById(event.url?.split('/')[1]).subscribe({
        next: (res:any) => {
          name=res[0].organization_name
          this.breadCrumbs.next([
            { label: 'Home', path: 'home' },
            { label: 'Organisations List', path: 'orgList' },
            { label: name, path: `/orgdetails/${event.url?.split('/')[1]}` },
            { label: `${event.url.split('/')[3] == '1' ? 'HSA' : (event.url.split('/')[3] === '2' ? 'Vitals':'RUW' )} Dashboard`, path: `${event.url.split('/')[1]}/pilotdashboard/${event.url.split('/')[3]}`, active: true},
      ])
      },
    });
  }
    }

    if(event.url?.split('/')[2]=='settings'){
      this.breadCrumbs.next([
        { label: 'Settings', path: `${event.url.split('/')[1]}/settings`},
        { label: 'Org Details', path: `${event.url.split('/')[1]}/settings`, active: true},
    ])
    }




    if(event.url?.split('/')[1] == 'vitals-dashboard'){
      this.breadCrumbs.next([
        { label: 'Home', path: 'home' },
        {label: `${event.url?.split('/')[2] === '1' ? 'HSA': (event.url?.split('/')[2] === '2' ? 'Vitals' : 'RUW')} Dashboard`, path: `event.url`, active: true}
    ])
  }
    if(event.url?.split('/')[1] == 'vitalsList'){
      this.breadCrumbs.next([
        { label: 'Home', path: 'home' },
        {label: `${event.url?.split('/')[2] === '1' ? 'HSA': (event.url?.split('/')[2][0] === '2' ? 'Vitals' : 'RUW')} Dashboard`, path: `/vitals-dashboard/${event.url?.split('/')[2][0]}`},
        {label: `Pilot List`, path: `/vitalsList/${event.url?.split('/')[2]}`, active: true}
    ])
    }

    
    if(event.url?.split('?')[0] =='/profile'){
      this.breadCrumbs.next([
        {label: `Profile`, path: `event.url`, active: true}
      ])
    }
    if(event.url?.split('/')[2] == 'userlist'){
      this.breadCrumbs.next([
        { label: 'Home', path: `${event.url.split('/')[1]}/dashboard`},
        { label: `${event.url.split('/')[3].split('?')[0] == '1' ? 'HSA' : (event.url.split('/')[3].split('?')[0] === '2' ? 'Vitals':'RUW' )} Dashboard`, path: `${event.url.split('/')[1]}/pilotdashboard/${event.url.split('/')[3].split('?')[0]}`},
        { label: `User List`, path: `${event.url}`, active: true},
      ])
    }
    
    
    if(event.url?.split('/')[2] =='home'){
      if(loggedInUser.hasOwnProperty('user_data')){
        //user
        this.breadCrumbs.next([
          {label: `Home`, path: event.url, active: true}
        ])
      }
      if(loggedInUser.hasOwnProperty('org_data') && loggedInUser.org_data[0].type !== 'admin'){
        //orgAdmin
        let userName = '';
        this.fetchUserListById(event.url?.split('/')[3]).subscribe((doc:any) =>{
          userName = doc[0].user_name
          this.breadCrumbs.next([
            {label: `Home`, path: `/${event.url?.split('/')[1]}/dashboard` },
            {label: `Users List`, path:  `/${event.url?.split('/')[1]}/userdetails`, },
            {label: userName, path: `/${event.url?.split('/')[1]}/userdetails`, active: true}
  
          ])
        })
      }
      if(loggedInUser.hasOwnProperty('org_data') && loggedInUser.org_data[0].type == 'admin'){
        //superadmin
        this.fetchOrgById(event.url?.split('/')[1]).subscribe({
          next: (res:any) => {
            name=res[0].organization_name;
            this.fetchUserListById(event.url?.split('/')[3]).subscribe((doc:any) =>{
              let userName = doc[0].user_name;
              this.breadCrumbs.next([
                { label: 'Home', path: 'home' },
                { label: 'Organisations List', path: 'orgList' },
                { label: name, path: `/orgdetails/${event.url?.split('/')[1]}` },
                { label: 'Users List', path: `/userdetails/${event.url?.split('/')[1]}` },
                { label: userName, path: event.url, active: true },
            ])
          });
          },
        });
      }
    }
    if(event.url?.split('/')[2] =='userdashboard'){
      this.breadCrumbs.next([
        {label: `Home`, path: `/${event.url?.split('/')[1]}/home`,},
        {label: `${event.url?.split('/')[3]== '1' ? 'HSA' : (event.url.split('/')[3] === '2' ? 'Vitals':'RUW' )} Dashboard`, path: event.url, active: true}
      ])
    }
    
    if(event.url?.split('/')[2] =='report'){
      if(loggedInUser.hasOwnProperty('user_data')){
        //user
        
      }
      if(loggedInUser.hasOwnProperty('org_data') && loggedInUser.org_data[0].type !== 'admin'){
        //orgAdmin
        this.breadCrumbs.next([
          {label: `Home`, path: `/${event.url?.split('/')[1]}/dashboard`,},
          {label: `${event.url?.split('/')[3][0]== '1' ? 'HSA' : (event.url.split('/')[3][0] === '2' ? 'Vitals':'RUW' )} Dashboard`, path: `/${event.url?.split('/')[1]}/pilotdashboard/${event.url.split('/')[3][0]}`},
          {label: `Report`, path: event.url, active: true}
        ])
      }
      if(loggedInUser.hasOwnProperty('org_data') && loggedInUser.org_data[0].type == 'admin'){
        //superadmin
        this.fetchOrgById(event.url?.split('/')[1]).subscribe({
          next: (res:any) => {
            name=res[0].organization_name
            this.breadCrumbs.next([
              { label: 'Home', path: 'home' },
              { label: 'Organisations List', path: 'orgList' },
              { label: name, path: `/orgdetails/${event.url?.split('/')[1]}` },
              { label: `${event.url.split('/')[3][0]== '1' ? 'HSA' : (event.url.split('/')[3][0] === '2' ? 'Vitals':'RUW' )} Report`, path: event.url, active: true },
          ])
          },
        });

      }
    }

    if(event.url?.split('/')[1] =='guestlist'){

      this.breadCrumbs.next([

        {label: `Home`, path: `/home`,},

        {label: `${event.url?.split('/')[2]== '1' ? 'HSA' : (event.url.split('/')[2] === '2' ? 'Vitals':'RUW' )} Dashboard`, path: `/vitals-dashboard/${event.url.split('/')[2]}`,},

        {label: `Guest List`, path: event.url, active: true}

      ])

    }
    
  }
  
  fetchProducts(){
    
    return this.http.get(`${ADMIN_URL}product`);
  }

  fetchGuests(prodId:any, page:any, perPage:any){

    return this.http.get(`${ADMIN_URL}user/list/users?product_id=${prodId}&page=${page}&per_page=${perPage}`); 
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
    fetchUserOfOrgProd(orgId:any, prodId:any,entries:any,pagenumber:any,deleted:any){

      return this.http.get(`${API_URL}users/${orgId}?product_id=${prodId}&is_deleted=${deleted}&page=${pagenumber}&per_page=${entries}`)
    }

    fetchDailyScan(orgId:any, prodId:any, date:any,pageNo:any,perPage:any){

      return this.http.get(`${API_PRODUCTS_TESTS}org?org_id=${orgId}&product_id=${prodId}&test_date=${date}&page=${pageNo}&per_page=${perPage}`)
    }
    fetchUsersDailyScan(userId:any, prodId:any, date:any,pageNo:any,perPage:any){

      return this.http.get(`${API_PRODUCTS_TESTS}users?user_id=${userId}&product_id=${prodId}&test_date=${date}&page=${pageNo}&per_page=${perPage}`)
    }

    fetchOrgScanByDateRange(orgId:any, prodId:any, date:any,last_date:any,pageNo:any,perPage:any,policy_number : any){

      if(policy_number == '') return this.http.get(`${API_PRODUCTS_TESTS}range/org?org_id=${orgId}&product_id=${prodId}&test_date=${date}&test_end_date=${last_date}&page=${pageNo}&per_page=${perPage}`);
      else return this.http.get(`${API_PRODUCTS_TESTS}range/org?org_id=${orgId}&product_id=${prodId}&test_date=${date}&test_end_date=${last_date}&page=${pageNo}&per_page=${perPage}&policy_number=${policy_number}`);
    }
    fetchUserScanByDateRange(userId:any, prodId:any, date:any,last_date:any,pageNo:any,perPage:any,policy_number : any){

      if(policy_number == '') return this.http.get(`${API_PRODUCTS_TESTS}range/user?user_id=${userId}&product_id=${prodId}&test_date=${date}&test_end_date=${last_date}&page=${pageNo}&per_page=${perPage}`)
      else return this.http.get(`${API_PRODUCTS_TESTS}range/user?user_id=${userId}&product_id=${prodId}&test_date=${date}&test_end_date=${last_date}&page=${pageNo}&per_page=${perPage}&policy_number=${policy_number}`)
    }

    fetchPerformanceChart(orgId:any, prodId:any, period:any){
      
      return this.http.get(`${API_PRODUCTS_TESTS}tests/org?org_id=${orgId}&product_id=${prodId}&period=${period}`)
    }

    fetchUserPerformanceChart(userId:any, prodId:any, period:any){

      return this.http.get(`${API_PRODUCTS_TESTS}tests/users?user_id=${userId}&product_id=${prodId}&period=${period}`)
    }
    updateGuestUser(data:any){
      return this.http.patch(`${ADMIN_URL}user`,data)
     
    }

    saveAsPDFInAWS(test_data:any){
      return this.http.post(`${API_URL}pre_signed/pdf/save`,test_data)
     
    }



}

