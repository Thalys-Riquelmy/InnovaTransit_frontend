import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { StorageService } from './storage.service';
import { TarefaService } from '../tarefa-service/tarefa.service';
import { FolhaServicoService } from '../folha-servico-service/folha-servico.service';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  constructor(
    private storageService: StorageService, 
    private tarefaService: TarefaService,
    private folhaServicoService: FolhaServicoService
  ) {
    this.listenForNetworkChanges();
    console.log('SyncService inicializado');
  }    

  private async listenForNetworkChanges() {
    Network.addListener('networkStatusChange', async (status) => {
      console.log('Status da rede alterado:', status.connected);
      if (status.connected) {
        await this.syncTasksWithBackend();
        await this.syncJornadasWithBackend();
      }
    });
  }

  // Método para adicionar tarefa
  async adicionarTarefa(tarefa: { id: number; horaInicio: string; estado: 'pendente' }) {
    try {
      await this.tarefaService.iniciarTarefa(tarefa.id, tarefa.horaInicio).toPromise();
      await this.storageService.adicionarTarefa(tarefa);
    } catch (error) {
      console.error('Erro ao adicionar tarefa no backend:', error);
      await this.storageService.adicionarTarefa(tarefa);
    }
  }

  // Método para finalizar tarefa
  async finalizarTarefa(tarefa: { id: number; horaFim: string; hodometroFinal: number; catracaFinal: number }) {
    try {
      await this.tarefaService.finalizarTarefa(tarefa.id, tarefa.horaFim, tarefa.hodometroFinal, tarefa.catracaFinal).toPromise();
      await this.storageService.removerTarefa(tarefa.id);
    } catch (error) {
      console.error('Erro ao finalizar tarefa no backend:', error);
    }
  }

  // Método para cancelar tarefa
  async cancelarTarefa(tarefa: { id: number; motivoCancelamento: string; horaFim: string }) {
    try {
      await this.tarefaService.cancelarTarefa(tarefa.id, tarefa.horaFim, tarefa.motivoCancelamento).toPromise();
      await this.storageService.removerTarefa(tarefa.id);
    } catch (error) {
      console.error('Erro ao cancelar tarefa no backend:', error);
    }
  }

  // Método para adicionar jornada
  async adicionarJornada(jornada: { id: number; horaInicial: string; estado: 'pendente' }) {
    try {
      await this.folhaServicoService.iniciarFolhaDeServico(jornada.id, jornada.horaInicial).toPromise();
      await this.storageService.adicionarJornada(jornada);
    } catch (error) {
      console.error('Erro ao adicionar jornada no backend:', error);
      await this.storageService.adicionarJornada(jornada);
    }
  }

  // Método para finalizar jornada
  async finalizarJornada(jornada: { id: number; horaFinal: string }) {
    try {
      await this.folhaServicoService.finalizarFolhaDeServico(jornada.id, jornada.horaFinal).toPromise();
      await this.storageService.removerJornada(jornada.id);
    } catch (error) {
      console.error('Erro ao finalizar jornada no backend:', error);
    }
  }

  private async syncTasksWithBackend() {
    const tarefasPendentes = await this.storageService.obterTodasTarefas();
    
    for (const tarefa of tarefasPendentes) {
      try {
        await this.tarefaService.iniciarTarefa(tarefa.id, tarefa.horaInicio).toPromise();
        await this.storageService.removerTarefa(tarefa.id);
      } catch (error) {
        console.error('Erro ao sincronizar tarefa com o backend:', error);
      }
    }
  }

  private async syncJornadasWithBackend() {
    const jornadasPendentes = await this.storageService.obterTodasJornadas();
    
    for (const jornada of jornadasPendentes) {
      try {
        await this.folhaServicoService.iniciarFolhaDeServico(jornada.id, jornada.horaInicial).toPromise();
        await this.storageService.removerJornada(jornada.id);
      } catch (error) {
        console.error('Erro ao sincronizar jornada com o backend:', error);
      }
    }
  }
}
