import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbDatepickerModule, NgbDropdownModule, NgbModalModule, NgbNavModule, NgbPaginationModule, NgbProgressbarModule, NgbTimepickerModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Select2Module } from 'ng-select2-component';
import { NgChartsModule } from 'ng2-charts';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { QuillModule } from 'ngx-quill';
import { DailyreportComponent } from 'src/app/dailyreport/dailyreport.component';
import { GuestListComponent } from 'src/app/guest-list/guest-list.component';
import { HomeComponent } from 'src/app/home/home.component';
import { NotificationListComponent } from 'src/app/notification-list/notification-list.component';
import { OrganisationDetailsComponent } from 'src/app/organisation-details/organisation-details.component';
import { OrganisationListComponent } from 'src/app/organisation-list/organisation-list.component';
import { PilotDashboardComponent } from 'src/app/pilot-dashboard/pilot-dashboard.component';
import { PilotsListComponent } from 'src/app/pilots-list/pilots-list.component';
import { ProfileComponent } from 'src/app/profile/profile.component';
import { SettingsComponent } from 'src/app/settings/settings.component';
import { AdvancedTableModule } from 'src/app/shared/advanced-table/advanced-table.module';
import { UserDetailsComponent } from 'src/app/user-details/user-details.component';
import { UserdashboardComponent } from 'src/app/userdashboard/userdashboard.component';
import { VitalsDashboardComponent } from 'src/app/vitals-dashboard/vitals-dashboard.component';
import { FormsRoutingModule } from '../forms/forms-routing.module';
import { TableAdvancedComponent } from './advanced/advanced.component';
import { TableBasicComponent } from './basic/basic.component';
import { TablesRoutingModule } from './tables-routing.module';



@NgModule({
  declarations: [
    TableBasicComponent,
    TableAdvancedComponent,
    VitalsDashboardComponent,
    HomeComponent,
    PilotsListComponent,
    OrganisationListComponent,
    OrganisationDetailsComponent,
    UserDetailsComponent,
    PilotDashboardComponent,
    UserdashboardComponent,
    SettingsComponent,
    ProfileComponent,
    DailyreportComponent,
    GuestListComponent,
    NotificationListComponent


    
  ],
  imports: [
    CommonModule,
    NgbDropdownModule,
    AdvancedTableModule,
    TablesRoutingModule,
    NgbProgressbarModule,
    NgbPaginationModule,
    FormsModule, 
    ReactiveFormsModule,
    NgbNavModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Select2Module,
    NgbTypeaheadModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    NgxDropzoneModule,
    QuillModule,
    NgbProgressbarModule,
    NgbNavModule,
    FormsRoutingModule,
    NgbModalModule,
    NgbDropdownModule,
    NgxSliderModule,
    NgbAlertModule,
    NgApexchartsModule,
    NgChartsModule
  ]
})
export class TablesModule { }
