import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PainelOperacaoComponent } from './painel-operacao/painel-operacao.component';

const routes: Routes = [
  { path: '', component: PainelOperacaoComponent }, // Defina a rota padrão do módulo de motorista
  // Adicione outras rotas do motorista aqui, se necessário
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GerentePagesRoutingModule { }
