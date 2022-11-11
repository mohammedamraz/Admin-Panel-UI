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
        path:'home',
        canActivate: [AuthGuard],
        component: HomeComponent
      },
      {
        path:'create',
        canActivate: [AuthGuard],
        component: CreateOrganizationComponent
      },
      {
        path:'vitals-dashboard/:id',
        canActivate: [AuthGuard],
        component: VitalsDashboardComponent
      },
      {
        path:'vitalsList/:id',
        canActivate: [AuthGuard],
        component: PilotsListComponent
      },
      {
        path:'orgList',
        canActivate: [AuthGuard],
        component: OrganisationListComponent
      },
      {
        path:'orgdetails/:orgId',
        canActivate: [AuthGuard],
        component: OrganisationDetailsComponent
      },
      {
        path:'userdetails/:orgId',
        canActivate: [AuthGuard],
        component: UserDetailsComponent
      },
      {
        path:':orgId/dashboard',
        canActivate: [OrgGuard],
        component: OrganisationDetailsComponent
      },
      {
        path:':orgId/settings',
        canActivate: [OrgGuard],
        component: SettingsComponent
      },
      {
        path: ':orgId/userdetails',
        canActivate: [OrgGuard],
        component: UserDetailsComponent
      },
      {
        path: ':orgId/userlist/:prodId',
        canActivate: [OrgGuard],
        component: UserDetailsComponent
      },
      {
        path: ':orgId/pilotdashboard/:Id',
        canActivate: [OrgGuard],
        component: PilotDashboardComponent
      },
      {
        path: ':orgId/userdashboard/:Id',
        canActivate: [OrgGuard],
        component: UserdashboardComponent
      },
      {
        path: 'profile',
        // canActivate: [OrgGuard],
        component: ProfileComponent
      },{
        path: ':orgId/home/:userId',
        canActivate: [OrgGuard],
        component: UserdashboardComponent
      },
      {
        path:':orgId/report/:prodId',
        canActivate: [OrgGuard],
        component: DailyreportComponent

      }
    
    ]
  },

  {
    path:':orgId/dashboard',
    canActivate: [OrgGuard],
    component: OrganisationDetailsComponent
  },
  {
    path: ':orgId/userdetails',
    canActivate: [OrgGuard],
    component: UserDetailsComponent
  },
  
  
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
