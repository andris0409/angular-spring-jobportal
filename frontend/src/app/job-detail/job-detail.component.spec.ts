import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobDetailComponent } from './job-detail.component';

describe('JobDetailComponent', () => {
  let component: JobDetailComponent;
  let fixture: ComponentFixture<JobDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobDetailComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(JobDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have job details', () => {
    expect(component.job.title).toBe('Software Engineer');
    expect(component.job.company).toBe('Tech Company');
  });

  it('should handle apply action', () => {
    spyOn(component, 'apply');
    component.apply();
    expect(component.apply).toHaveBeenCalled();
  });

  it('should handle save action', () => {
    spyOn(component, 'save');
    component.save();
    expect(component.save).toHaveBeenCalled();
  });
});
