import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PainelOperacaoComponent } from './painel-operacao/painel-operacao.component';
import { PainelApiExternaComponent } from './painel-api-externa/painel-api-externa.component';
import { PainelCadastroEmpresaComponent } from './painel-cadastro-empresa/painel-cadastro-empresa.component';
import { PainelCadastroGerenteComponent } from './painel-cadastro-gerente/painel-cadastro-gerente.component';

const routes: Routes = [
  { path: '', redirectTo: 'painel-operacao', pathMatch: 'full' }, // Redireciona para o dashboard por padrão
  { path: 'painel-operacao', component: PainelOperacaoComponent},
  { path: 'painel-api-externa', component: PainelApiExternaComponent},
  { path: 'painel-cadastro-empresa', component: PainelCadastroEmpresaComponent},
  { path: 'painel-cadastro-gerente', component: PainelCadastroGerenteComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GerentePagesRoutingModule { }
