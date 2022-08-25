import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalsDashboardComponent } from './vitals-dashboard.component';

describe('VitalsDashboardComponent', () => {
  let component: VitalsDashboardComponent;
  let fixture: ComponentFixture<VitalsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VitalsDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VitalsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
