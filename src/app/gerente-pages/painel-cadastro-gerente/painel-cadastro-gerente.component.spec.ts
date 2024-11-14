import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PainelCadastroGerenteComponent } from './painel-cadastro-gerente.component';

describe('PainelCadastroGerenteComponent', () => {
  let component: PainelCadastroGerenteComponent;
  let fixture: ComponentFixture<PainelCadastroGerenteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PainelCadastroGerenteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PainelCadastroGerenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
