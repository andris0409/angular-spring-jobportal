import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicProfileComponentComponent } from './dynamic-profile-component.component';

describe('DynamicProfileComponentComponent', () => {
  let component: DynamicProfileComponentComponent;
  let fixture: ComponentFixture<DynamicProfileComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynamicProfileComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicProfileComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
