import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonProfileCardComponent } from './person-profile-card.component';

describe('PersonProfileCardComponent', () => {
  let component: PersonProfileCardComponent;
  let fixture: ComponentFixture<PersonProfileCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonProfileCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonProfileCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
