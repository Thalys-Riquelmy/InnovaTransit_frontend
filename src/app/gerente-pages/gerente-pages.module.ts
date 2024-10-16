import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GerentePagesRoutingModule } from './gerente-pages-routing.module';
import { PainelOperacaoComponent } from './painel-operacao/painel-operacao.component';

@NgModule({
  imports: [
    CommonModule,
    GerentePagesRoutingModule,
    PainelOperacaoComponent
  ]
})
export class GerentePagesModule { }
