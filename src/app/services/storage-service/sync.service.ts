import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { StorageService } from './storage.service';
import { TarefaService } from '../tarefa-service/tarefa.service'; // Importa seu serviço para interagir com o backend

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  constructor(private storageService: StorageService, private tarefaService: TarefaService) {
    this.listenForNetworkChanges(); // Escuta mudanças na rede
  }

  private async listenForNetworkChanges() {
    // Adiciona um listener para mudanças no status da rede
    Network.addListener('networkStatusChange', async (status) => {
      if (status.connected) {
        await this.syncTasksWithBackend(); // Sincroniza tarefas se a rede estiver conectada
      }
    });
  }

  // Método para adicionar tarefa
  async adicionarTarefa(tarefa: { id: number; horaInicio: string; estado: 'pendente' }) {
    // Primeiro, tenta adicionar a tarefa ao backend
    try {
      await this.tarefaService.iniciarTarefa(tarefa.id, tarefa.horaInicio).toPromise(); // Tenta adicionar no backend
      // Se a adição for bem-sucedida, armazena a tarefa no IndexedDB
      await this.storageService.adicionarTarefa(tarefa);
    } catch (error) {
      console.error('Erro ao adicionar tarefa no backend:', error);
      // Se falhar, armazena a tarefa no IndexedDB mesmo assim
      await this.storageService.adicionarTarefa(tarefa);
    }
  }

  private async syncTasksWithBackend() {
    const tarefasPendentes = await this.storageService.obterTodasTarefas(); // Obtém todas as tarefas pendentes

    for (const tarefa of tarefasPendentes) {
      try {
        // Envia a tarefa para o backend
        await this.tarefaService.iniciarTarefa(tarefa.id, tarefa.horaInicio).toPromise();
        // Se a tarefa foi iniciada com sucesso, remove do IndexedDB
        await this.storageService.removerTarefa(tarefa.id);
      } catch (error) {
        console.error('Erro ao sincronizar tarefa com o backend:', error); // Log de erro caso falhe a sincronização
      }
    }
  }
}
