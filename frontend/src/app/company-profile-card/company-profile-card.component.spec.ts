import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyProfileCardComponent } from './company-profile-card.component';

describe('CompanyProfileCardComponent', () => {
  let component: CompanyProfileCardComponent;
  let fixture: ComponentFixture<CompanyProfileCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyProfileCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyProfileCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
