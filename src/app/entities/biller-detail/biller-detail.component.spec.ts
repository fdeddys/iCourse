import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillerDetailComponent } from './biller-detail.component';

describe('BillerDetailComponent', () => {
  let component: BillerDetailComponent;
  let fixture: ComponentFixture<BillerDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillerDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
