import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalSettingComponent } from './global-setting.component';

describe('GlobalSettingComponent', () => {
  let component: GlobalSettingComponent;
  let fixture: ComponentFixture<GlobalSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
