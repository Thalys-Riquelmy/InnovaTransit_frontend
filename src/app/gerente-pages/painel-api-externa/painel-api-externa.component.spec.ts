import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PainelApiExternaComponent } from './painel-api-externa.component';

describe('PainelApiExternaComponent', () => {
  let component: PainelApiExternaComponent;
  let fixture: ComponentFixture<PainelApiExternaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PainelApiExternaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PainelApiExternaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
