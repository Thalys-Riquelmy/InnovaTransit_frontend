import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GerentePagesRoutingModule } from './gerente-pages-routing.module';
import { PainelOperacaoComponent } from './painel-operacao/painel-operacao.component';


@NgModule({
  declarations: [PainelOperacaoComponent],
  imports: [
    CommonModule, GerentePagesRoutingModule, 
  ]
})
export class GerentePagesModule { }