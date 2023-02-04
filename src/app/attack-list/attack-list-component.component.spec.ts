import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttackListComponent } from './attack-list-component.component';

describe('AttackListComponent', () => {
  let component: AttackListComponent;
  let fixture: ComponentFixture<AttackListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttackListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttackListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
