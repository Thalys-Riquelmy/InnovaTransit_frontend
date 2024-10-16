import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotoristaPagesRoutingModule } from './motorista-pages-routing.module';
import { OperacaoMotoristaComponent } from './operacao-motorista/operacao-motorista.component';

@NgModule({
  imports: [
    CommonModule,
    MotoristaPagesRoutingModule,
    OperacaoMotoristaComponent
  ]
})
export class MotoristaPagesModule { }
