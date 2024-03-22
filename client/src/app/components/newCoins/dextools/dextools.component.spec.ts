import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DextoolsComponent } from './dextools.component';

describe('DextoolsComponent', () => {
  let component: DextoolsComponent;
  let fixture: ComponentFixture<DextoolsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DextoolsComponent]
    });
    fixture = TestBed.createComponent(DextoolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
