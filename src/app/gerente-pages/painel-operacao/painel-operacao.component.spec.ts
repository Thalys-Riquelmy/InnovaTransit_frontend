import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelOperacaoComponent } from './painel-operacao.component';

describe('PainelOperacaoComponent', () => {
  let component: PainelOperacaoComponent;
  let fixture: ComponentFixture<PainelOperacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PainelOperacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PainelOperacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
