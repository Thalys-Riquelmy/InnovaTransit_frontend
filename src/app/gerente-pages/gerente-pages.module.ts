import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GerentePagesRoutingModule } from './gerente-pages-routing.module';
import { PainelOperacaoComponent } from './painel-operacao/painel-operacao.component';
import { PainelApiExternaComponent } from './painel-api-externa/painel-api-externa.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule, GerentePagesRoutingModule, PainelOperacaoComponent, PainelApiExternaComponent
  ]
})
export class GerentePagesModule { }