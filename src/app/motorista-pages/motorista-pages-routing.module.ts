import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperacaoMotoristaComponent } from './operacao-motorista/operacao-motorista.component';

const routes: Routes = [
  { path: '', component: OperacaoMotoristaComponent }, // Defina a rota padrão do módulo de motorista
  // Adicione outras rotas do motorista aqui, se necessário
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MotoristaPagesRoutingModule { }
