import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthOrgGuard } from './core/guards/auth-org.gaurd';
import { AuthGuard } from './core/guards/auth.guard';
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

const routes: Routes = [
  { 
    path: 'vital/:id',     
    canActivate: [AuthOrgGuard],
    component: OrganisationDetailsComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: LayoutContainerComponent,
    canActivate: [AuthGuard],
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
        component: HomeComponent
      },
      {
        path:'create',
        component: CreateOrganizationComponent
      },
      {
        path:'vitals-dashboard',
        component: VitalsDashboardComponent
      },
      {
        path:'vitalsList',
        component: PilotsListComponent
      },
      {
        path:'orgList',
        component: OrganisationListComponent
      },
      {
        path:'orgdetails/:orgId',
        component: OrganisationDetailsComponent
      },
      {
        path:'userdetails/:orgId',
        component: UserDetailsComponent
      },

    ]
  },
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
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
export class AppRoutingModule { }
