import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GerentePagesRoutingModule } from './gerente-pages-routing.module';
import { PainelOperacaoComponent } from './painel-operacao/painel-operacao.component';
import { PainelApiExternaComponent } from './painel-api-externa/painel-api-externa.component';
import { PainelCadastroEmpresaComponent } from './painel-cadastro-empresa/painel-cadastro-empresa.component';
import { PainelCadastroGerenteComponent } from './painel-cadastro-gerente/painel-cadastro-gerente.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule, GerentePagesRoutingModule, PainelOperacaoComponent, PainelApiExternaComponent, PainelCadastroEmpresaComponent, 
    PainelCadastroGerenteComponent
  ]
})
export class GerentePagesModule { }