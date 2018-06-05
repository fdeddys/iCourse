import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillerPriceDetailComponent } from './biller-price-detail.component';

describe('BillerPriceDetailComponent', () => {
  let component: BillerPriceDetailComponent;
  let fixture: ComponentFixture<BillerPriceDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillerPriceDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillerPriceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
