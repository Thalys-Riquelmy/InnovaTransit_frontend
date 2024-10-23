import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PainelOperacaoComponent } from './painel-operacao/painel-operacao.component';

const routes: Routes = [
  { path: '', redirectTo: 'painel-operacao', pathMatch: 'full' }, // Redireciona para o dashboard por padrão
  { path: 'painel-operacao', component: PainelOperacaoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GerentePagesRoutingModule { }
