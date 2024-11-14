import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PainelCadastroEmpresaComponent } from './painel-cadastro-empresa.component';

describe('PainelCadastroEmpresaComponent', () => {
  let component: PainelCadastroEmpresaComponent;
  let fixture: ComponentFixture<PainelCadastroEmpresaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PainelCadastroEmpresaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PainelCadastroEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
