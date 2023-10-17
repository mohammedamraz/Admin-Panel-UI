import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthOrgGuard } from './core/guards/auth-org.gaurd';
import { AuthGuard } from './core/guards/auth.guard';
import { OrgGuard } from './core/guards/org.gaurd';
import { CreateOrganizationComponent } from './create-organization/create-organization.component';
import { HomeComponent } from './home/home.component';
import { LayoutContainerComponent } from './layout/layout-container/layout-container.component';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { OrganisationDetailsComponent } from './organisation-details/organisation-details.component';
import { OrganisationListComponent } from './organisation-list/organisation-list.component';
import { ComingSoonComponent } from './pages/extra-pages/coming-soon/coming-soon.component';
import { Error404Component } from './pages/extra-pages/error404/error404.component';
import { Error500Component } from './pages/extra-pages/error500/error500.component';
import { MaintenanceComponent } from './pages/extra-pages/maintenance/maintenance.component';
import { PilotsListComponent } from './pilots-list/pilots-list.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { VitalsDashboardComponent } from './vitals-dashboard/vitals-dashboard.component';
import { PilotDashboardComponent } from './pilot-dashboard/pilot-dashboard.component';
import { UserdashboardComponent } from './userdashboard/userdashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { DailyreportComponent } from './dailyreport/dailyreport.component';
import { GuestListComponent } from './guest-list/guest-list.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { UserGuard } from './core/guards/user.guard';
import { AuthguardGuard } from './core/guards/authguard.guard';
import { MultiAdminGuard } from './core/guards/multi-admin.guard';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';



const routes: Routes = [
  { 
    path: 'vital/:id',     
    canActivate: [AuthOrgGuard],
    component: OrganisationDetailsComponent
  },
  {
    path: '',
    redirectTo: 'orgLogin',
    pathMatch: 'full'
  },
  {
    path: '',
    component: LayoutContainerComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
      },
      {
        path: 'apps',
        loadChildren: () => import('./apps/apps.module').then(m => m.AppsModule)
      },
      {
        //super admin
        path:'home',
        canActivate: [AuthGuard],
        component: HomeComponent
      },
      {
        // super admin
        path:'vitals-dashboard/:id',
        canActivate: [AuthGuard],
        component: VitalsDashboardComponent
      },
      {
        // super admin
        path:'vitalsList/:id',
        canActivate: [AuthGuard],
        component: PilotsListComponent
      },
      {
        // super admin
        path:'orgList',
        canActivate: [AuthGuard],
        component: OrganisationListComponent
      },
      {
        // super admin
        path:'orgdetails/:orgId',
        canActivate: [AuthGuard],
        component: OrganisationDetailsComponent
      },
      {
        // super admin
        path:'userdetails/:orgId',
        canActivate: [AuthGuard],
        component: UserDetailsComponent
      },
      {
        // org admin
        path:':orgId/dashboard',
        canActivate: [OrgGuard],
        component: OrganisationDetailsComponent
      },
      {
        // org admin
        path:':orgId/settings',
        canActivate: [OrgGuard],
        component: SettingsComponent
      },
      {
        //org admin
        path: ':orgId/userdetails',
        canActivate: [OrgGuard],
        component: UserDetailsComponent
      },
      {
        // super admin and org admin
        path: ':orgId/userlist/:prodId',
        canActivate: [MultiAdminGuard],
        component: UserDetailsComponent
      },
      {
        // super admin and org admin
        path: ':orgId/pilotdashboard/:Id',
        canActivate: [MultiAdminGuard],
        component: PilotDashboardComponent
      },
      {
        // user
        path: ':orgId/userdashboard/:Id',
        canActivate: [UserGuard],
        component: UserdashboardComponent
      },
      {
        path: 'profile',
        canActivate: [AuthguardGuard],
        component: ProfileComponent
      },{
        //super admin and org admin
        path: ':orgId/home/:userId',
        canActivate: [MultiAdminGuard],
        component: UserdashboardComponent
      },
      {
        path:':orgId/report/:prodId',
        canActivate: [AuthguardGuard],
        component: DailyreportComponent

      }
      ,{
        // super admin
        path: 'guestlist/:prodId',
        canActivate: [AuthGuard],
        component: GuestListComponent
      },
      {
        //super admin
        path: 'notificationList',
        canActivate: [AuthGuard],
        component: NotificationListComponent
      },
      {
        path: 'admin-dashboard',
        canActivate: [OrgGuard],
        component: AdminDashboardComponent
    
    
      },
      {
        path: ':orgId/admin-dashboard',
        canActivate: [OrgGuard],
        component: AdminDashboardComponent
    
    
      },
    
    ]
  },

  // {
  //   //org admin
  //   path:':orgId/dashboard',
  //   canActivate: [OrgGuard],
  //   component: OrganisationDetailsComponent
  // },
  // {
  //   //org admin
  //   path: ':orgId/userdetails',
  //   canActivate: [OrgGuard],
  //   component: UserDetailsComponent
  // },
  
  
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
      {
        path: 'error-404',
        component: Error404Component
      },
      {
        path: 'error-500',
        component: Error500Component
      },
      {
        path: 'maintenance',
        component: MaintenanceComponent
      },
      {
        path: 'coming-soon',
        component: ComingSoonComponent
      },
      { path: 'landing', loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
})
export class  AppRoutingModule { }
