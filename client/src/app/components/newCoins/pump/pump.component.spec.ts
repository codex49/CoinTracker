import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PumpComponent } from './pump.component';

describe('PumpComponent', () => {
  let component: PumpComponent;
  let fixture: ComponentFixture<PumpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PumpComponent]
    });
    fixture = TestBed.createComponent(PumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
