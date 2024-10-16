import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperacaoMotoristaComponent } from './operacao-motorista.component';

describe('OperacaoMotoristaComponent', () => {
  let component: OperacaoMotoristaComponent;
  let fixture: ComponentFixture<OperacaoMotoristaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperacaoMotoristaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperacaoMotoristaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
