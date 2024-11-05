import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FolhaServicoComponent } from './folha-servico/folha-servico.component';
import { IniciarJornadaComponent } from './iniciar-jornada/iniciar-jornada.component';
import { IniciarTarefaComponent } from './iniciar-tarefa/iniciar-tarefa.component';
import { FinalizarTarefaComponent } from './finalizar-tarefa/finalizar-tarefa.component';
import { ExibirViagensComponent } from './exibir-viagens/exibir-viagens.component';

const routes: Routes = [
  { path: '', redirectTo: 'folha-servico', pathMatch: 'full'},
  { path: 'folha-servico', component: FolhaServicoComponent},
  { path: 'iniciar-jornada', component: IniciarJornadaComponent},
  { path: 'iniciar-tarefa', component: IniciarTarefaComponent},
  { path: 'finalizar-tarefa', component: FinalizarTarefaComponent},
  { path: 'exibir-viagens', component: ExibirViagensComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MotoristaPagesRoutingModule { }
