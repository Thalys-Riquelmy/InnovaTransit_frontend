import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PainelOperacaoComponent } from './painel-operacao/painel-operacao.component';
import { PainelApiExternaComponent } from './painel-api-externa/painel-api-externa.component';

const routes: Routes = [
  { path: '', redirectTo: 'painel-operacao', pathMatch: 'full' }, // Redireciona para o dashboard por padrão
  { path: 'painel-operacao', component: PainelOperacaoComponent},
  { path: 'painel-api-externa', component: PainelApiExternaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GerentePagesRoutingModule { }
