import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAdvertComponent } from './company-advert.component';

describe('CompanyAdvertComponent', () => {
  let component: CompanyAdvertComponent;
  let fixture: ComponentFixture<CompanyAdvertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyAdvertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyAdvertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
