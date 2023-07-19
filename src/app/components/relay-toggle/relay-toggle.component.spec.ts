import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelayToggleComponent } from './relay-toggle.component';

describe('RelayToggleComponent', () => {
  let component: RelayToggleComponent;
  let fixture: ComponentFixture<RelayToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RelayToggleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RelayToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
