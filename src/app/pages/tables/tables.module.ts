import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbDropdownModule, NgbModalModule, NgbNavModule, NgbPaginationModule, NgbProgressbarModule, NgbTimepickerModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Select2Module } from 'ng-select2-component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { QuillModule } from 'ngx-quill';
import { CreateOrganizationComponent } from 'src/app/create-organization/create-organization.component';
import { HomeComponent } from 'src/app/home/home.component';
import { AdvancedTableModule } from 'src/app/shared/advanced-table/advanced-table.module';
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
    HomeComponent
    
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
  ]
})
export class TablesModule { }
