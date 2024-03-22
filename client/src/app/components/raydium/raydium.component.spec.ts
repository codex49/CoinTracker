import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaydiumComponent } from './raydium.component';

describe('RaydiumComponent', () => {
  let component: RaydiumComponent;
  let fixture: ComponentFixture<RaydiumComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RaydiumComponent]
    });
    fixture = TestBed.createComponent(RaydiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
