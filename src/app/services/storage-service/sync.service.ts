import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { StorageService } from './storage.service'; 
import { TarefaService } from '../tarefa-service/tarefa.service';
import { FolhaServico } from 'src/app/models/folha-servico';
import { Tarefa } from 'src/app/models/tarefa';
import { FolhaServicoService } from '../folha-servico-service/folha-servico.service';

@Injectable({
    providedIn: 'root',
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
        await this.syncFolhasServicoWithBackend(); 
      }
    });
  }

  // Método para adicionar uma nova tarefa
  async adicionarTarefa(tarefa: Tarefa) {
    try {
      await this.tarefaService.iniciarTarefa(tarefa.id, tarefa.horaInicio).toPromise();
      await this.storageService.saveTarefa(tarefa);
    } catch (error) {
      console.error('Erro ao adicionar tarefa no backend:', error);
      await this.storageService.saveTarefa(tarefa);
    }
  }

  // Método para iniciar uma tarefa no IndexedDB
  async iniciarTarefa(id: number, horaInicio: string) {
    try {
      await this.tarefaService.iniciarTarefa(id, horaInicio).toPromise();
      await this.storageService.iniciarTarefaLocal(id, horaInicio);
    } catch (error) {
      console.error('Erro ao iniciar tarefa no backend:', error);
      // Lidar com erro, se necessário
    }
  }

  // Método para finalizar uma tarefa no IndexedDB
  async finalizarTarefa(id: number, horaFim: string, hodometroFinal: number, catracaFinal: number) {
    try {
      await this.tarefaService.finalizarTarefa(id, horaFim, hodometroFinal, catracaFinal).toPromise();
      await this.storageService.finalizarTarefaLocal(id, horaFim, hodometroFinal, catracaFinal);
    } catch (error) {
      console.error('Erro ao finalizar tarefa no backend:', error);
      // Lidar com erro, se necessário
    }
  }

  // Método para cancelar uma tarefa
  async cancelarTarefa(id: number, horaFim: string, motivoCancelamento: string) {
    try {
      await this.tarefaService.cancelarTarefa(id, horaFim, motivoCancelamento).toPromise();
      await this.storageService.cancelarTarefaLocal(id, horaFim, motivoCancelamento);
    } catch (error) {
      console.error('Erro ao cancelar tarefa no backend:', error);
      // Lidar com erro, se necessário
    }
  }

  // Método para iniciar uma folha de serviço
  async iniciarFolhaServico(id: number, horaInicio: string) {
    try {
      await this.folhaServicoService.iniciarFolhaDeServico(id, horaInicio).toPromise();
      await this.storageService.iniciarFolhaServicoLocal(id, horaInicio);
    } catch (error) {
      console.error('Erro ao iniciar folha de serviço no backend:', error);
      await this.storageService.iniciarFolhaServicoLocal(id, horaInicio);
    }
  }

  // Método para finalizar uma folha de serviço
  async finalizarFolhaServico(id: number, horaFinal: string) {
    try {
      await this.folhaServicoService.finalizarFolhaDeServico(id, horaFinal).toPromise();
      await this.storageService.finalizarFolhaServicoLocal(id, horaFinal);
    } catch (error) {
      console.error('Erro ao finalizar folha de serviço no backend:', error);
      // Você pode querer implementar lógica adicional aqui
    }
  }

  /*// Método para sincronizar tarefas pendentes com o backend
  private async syncTasksWithBackend() {
    const tarefasPendentes = await this.storageService.getAllTarefas();

    for (const tarefa of tarefasPendentes) {
      let tentativas = 0;
      const maxTentativas = 3; // Número máximo de tentativas

      while (tentativas < maxTentativas) {
        try {
          // Tente iniciar a tarefa
          await this.tarefaService.iniciarTarefa(tarefa.id, tarefa.horaInicio).toPromise();
          
          // Se for bem-sucedido, remova a tarefa do IndexedDB
          await this.storageService.deleteTarefa(tarefa.id);
          console.log(`Tarefa ${tarefa.id} sincronizada com sucesso!`);
          break; // Sai do loop se a sincronização foi bem-sucedida
        } catch (error) {
          tentativas++;
          console.error(`Erro ao sincronizar tarefa ${tarefa.id} com o backend: ${error}. Tentativa ${tentativas} de ${maxTentativas}.`);

          // Aguarde antes de tentar novamente (60 segundos)
          await new Promise(resolve => setTimeout(resolve, 60000)); // Espera 60 segundos

          // Se atingiu o número máximo de tentativas
          if (tentativas >= maxTentativas) {
            console.log(`Atingido o número máximo de tentativas para a tarefa ${tarefa.id}. A tarefa permanecerá no IndexedDB para nova tentativa.`);
            // A tarefa não será removida, será mantida para tentativas futuras
          }
        }
      }
    }
  }

  // Método para sincronizar folhas de serviço pendentes com o backend
  private async syncFolhasServicoWithBackend() {
    const folhasServicoPendentes = await this.storageService.getAllFolhasServico(); 

    for (const folhaServico of folhasServicoPendentes) {
      let tentativas = 0;
      const maxTentativas = 3; // Número máximo de tentativas

      while (tentativas < maxTentativas) {
        try {
          // Tente finalizar a folha de serviço
          await this.folhaServicoService.finalizarFolhaDeServico(folhaServico.id, folhaServico.horaFinal).toPromise();
          
          // Se for bem-sucedido, remova a folha de serviço do IndexedDB
          await this.storageService.deleteFolhaServico(folhaServico.id);
          console.log(`Folha de serviço ${folhaServico.id} sincronizada com sucesso!`);
          break; // Sai do loop se a sincronização foi bem-sucedida
        } catch (error) {
          tentativas++;
          console.error(`Erro ao sincronizar folha de serviço ${folhaServico.id} com o backend: ${error}. Tentativa ${tentativas} de ${maxTentativas}.`);

          // Aguarde antes de tentar novamente (60 segundos)
          await new Promise(resolve => setTimeout(resolve, 60000)); // Espera 60 segundos

          // Se atingiu o número máximo de tentativas
          if (tentativas >= maxTentativas) {
            console.log(`Atingido o número máximo de tentativas para a folha de serviço ${folhaServico.id}. A folha de serviço permanecerá no IndexedDB para nova tentativa.`);
            // A folha de serviço não será removida, será mantida para tentativas futuras
          }
        }
      }
    }
  }*/

    // Método para sincronizar tarefas pendentes com o backend, uma de cada vez, com uma tentativa por minuto
  private async syncTasksWithBackend() {
    const tarefasPendentes = await this.storageService.getAllTarefas();

    for (const tarefa of tarefasPendentes) {
      try {
        // Tente iniciar a tarefa
        await this.tarefaService.iniciarTarefa(tarefa.id, tarefa.horaInicio).toPromise();
        
        // Se for bem-sucedido, remova a tarefa do IndexedDB
        await this.storageService.deleteTarefa(tarefa.id);
        console.log(`Tarefa ${tarefa.id} sincronizada com sucesso!`);
      } catch (error) {
        console.error(`Erro ao sincronizar tarefa ${tarefa.id} com o backend: ${error}.`);

        // Aguardar 60 segundos antes de prosseguir para a próxima tarefa
        console.log(`Aguardando 1 minuto antes de tentar sincronizar novamente...`);
        await new Promise(resolve => setTimeout(resolve, 60000)); // Espera 60 segundos
      }
    }
  }

  // Método para sincronizar folhas de serviço pendentes com o backend, uma de cada vez, com uma tentativa por minuto
  private async syncFolhasServicoWithBackend() {
    const folhasServicoPendentes = await this.storageService.getAllFolhasServico(); 

    for (const folhaServico of folhasServicoPendentes) {
      try {
        // Tente finalizar a folha de serviço
        await this.folhaServicoService.finalizarFolhaDeServico(folhaServico.id, folhaServico.horaFinal).toPromise();
        
        // Se for bem-sucedido, remova a folha de serviço do IndexedDB
        await this.storageService.deleteFolhaServico(folhaServico.id);
        console.log(`Folha de serviço ${folhaServico.id} sincronizada com sucesso!`);
      } catch (error) {
        console.error(`Erro ao sincronizar folha de serviço ${folhaServico.id} com o backend: ${error}.`);

        // Aguardar 60 segundos antes de prosseguir para a próxima folha de serviço
        console.log(`Aguardando 1 minuto antes de tentar sincronizar novamente...`);
        await new Promise(resolve => setTimeout(resolve, 60000)); // Espera 60 segundos
      }
    }
  }

}
