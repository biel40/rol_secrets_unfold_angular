import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckRolStatsComponent } from './check-rol-stats.component';

describe('CheckRolStatsComponent', () => {
  let component: CheckRolStatsComponent;
  let fixture: ComponentFixture<CheckRolStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckRolStatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckRolStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
