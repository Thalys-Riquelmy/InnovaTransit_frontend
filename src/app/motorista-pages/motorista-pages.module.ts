import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MotoristaPagesRoutingModule } from './motorista-pages-routing.module';
import { FolhaServicoComponent } from './folha-servico/folha-servico.component';
import { IniciarJornadaComponent } from './iniciar-jornada/iniciar-jornada.component';
import { IniciarTarefaComponent } from './iniciar-tarefa/iniciar-tarefa.component';
import { FinalizarTarefaComponent } from './finalizar-tarefa/finalizar-tarefa.component';
import { EstornarTarefaComponent } from './estornar-tarefa/estornar-tarefa.component';
import { ExibirViagensComponent } from './exibir-viagens/exibir-viagens.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MotoristaPagesRoutingModule, FolhaServicoComponent, IniciarJornadaComponent, IniciarTarefaComponent, 
    FinalizarTarefaComponent, EstornarTarefaComponent, ExibirViagensComponent 
  ]
})
export class MotoristaPagesModule { }

