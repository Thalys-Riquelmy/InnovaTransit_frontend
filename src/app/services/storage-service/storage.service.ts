import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { FolhaServico } from '../../models/folha-servico';
import { Tarefa } from 'src/app/models/tarefa';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
  private dbPromise: Promise<IDBPDatabase>;

  constructor() {
      this.dbPromise = this.initDB();
  }

  private async initDB(): Promise<IDBPDatabase> {
    return openDB('InnovaDB', 1, {
        upgrade(db) {
          db.createObjectStore('tarefas', { keyPath: 'id' });
          db.createObjectStore('folhasServico', { keyPath: 'id' }); // Cria o objeto para FolhaServico

          // Criação do object store 'servidor' com a URL do servidor
          if (!db.objectStoreNames.contains('servidor')) {
            db.createObjectStore('servidor', { keyPath: 'id', autoIncrement: true });
          }
        },
    });
  }

  // MÉTODOS RELACIONADOS AO SERVIDOR //

  // Salvar a URL do servidor
  async saveServidor(url_servidor: string): Promise<void> {
    const db = await this.dbPromise;
    const existingServidor = await db.getAll('servidor');// Se houver algum registro, exclua-o
    if (existingServidor && existingServidor.length > 0) {
      await db.clear('servidor');  // Limpa todos os registros do object store 'servidor'
    }
    const servidor = { url_servidor };
    await db.put('servidor', servidor);
  }  

  // Obter a URL do servidor
  async getServidor(): Promise<{ url_servidor: string } | null> {
    const db = await this.dbPromise;
    const servidor = await db.getAll('servidor');
  
    if (servidor && servidor.length > 0) {
      return servidor[0]; // Retorna o primeiro registro encontrado
    } else {
      return null; // Nenhuma URL salva
    }
  }
  

  // Verificar se a URL do servidor já está salva
  async isServidorSaved(url_servidor: string): Promise<boolean> {
    const db = await this.dbPromise;
    const servidor = await db.getFromIndex('servidor', 'url_servidor', url_servidor);
    return servidor !== undefined;
  }

  // MÉTODOS RELACIONADOS A TAREFAS //

  // Método para salvar uma tarefa
  async saveTarefa(tarefa: Tarefa): Promise<void> {
    const db = await this.dbPromise;
    await db.put('tarefas', tarefa);
  }

  // Método para armazenar uma tarefa novamente
  async storeTarefa(tarefa: Tarefa): Promise<void> {
  const db = await this.dbPromise;
  await db.put('tarefas', tarefa); // Armazena ou atualiza a tarefa no IndexedDB
  }

  // Método para obter todas as tarefas
  async getAllTarefas(): Promise<Tarefa[]> {
    const db = await this.dbPromise;
    return db.getAll('tarefas');
  }

  // Método para deletar uma tarefa pelo ID
  async deleteTarefa(id: number): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('tarefas', id);
  }

  // Método para iniciar uma tarefa no IndexedDB
  async iniciarTarefaLocal(id: number, horaInicio: string): Promise<void> {
    const db = await this.dbPromise;
    const tarefa = await db.get('tarefas', id);

    if (!tarefa) {
        throw new Error('Tarefa não encontrada');
    }

    // Atualiza a hora de início
    tarefa.horaInicio = horaInicio;

    // Salva a tarefa atualizada no IndexedDB
    await db.put('tarefas', tarefa);
  }

  //Metodo para finalizar uma tarefa no indexedDB
  async finalizarTarefaLocal(id: number, horaFim: string, hodometroFinal: number, catracaFinal: number): Promise<void> {
    const db = await this.dbPromise;
    const tarefa = await db.get('tarefas', id);

    if(!tarefa) {
      throw new Error ('Tarefa não encontrada');
    }

    //Atualiza a horaFim, catraca e hodometro
    tarefa.horaFim = horaFim;
    tarefa.hodometroFinal = hodometroFinal;
    tarefa.catracaFinal = catracaFinal;

    //Salva a tarefa atualizada no indexedDB
    await db.put('tarefas', tarefa);
  }

  //Metodo para cancelar uma tarefa no indexedDB
  async cancelarTarefaLocal(id: number, horaFim: string, motivoCancelamento: string): Promise<void> {
    const db = await this.dbPromise;
    const tarefa = await db.get('tarefas', id);

    if(!tarefa) {
      throw new Error ('Tarefa não encontrada');
    }

    //Atualiza a horaFim e o motivoCancelamento
    tarefa.horaFim = horaFim;
    tarefa.motivoCancelamento = motivoCancelamento;

    //Salva a tarefa atualizada no indexedDB
    await db.put('tarefas', tarefa);
  }

    // MÉTODOS RELACIONADOS A FOLHAS DE SERVIÇOS //

  // Método para obter todas as tarefas
  async getAllFolhasServico(): Promise<FolhaServico[]> {
    const db = await this.dbPromise;
    return db.getAll('folhasServico');
}

  // Método para salvar uma folha de serviço
  async saveFolhaServico(folhaServico: FolhaServico): Promise<void> {
    const db = await this.dbPromise;
    await db.put('folhasServico', folhaServico);
  }

  // Método para deletar folha de servico pelo id
  async deleteFolhaServico(id: number): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('folhasServico', id);
  }

  // Método para iniciar a folha de serviço localmente no IndexedDB
  async iniciarFolhaServicoLocal(id: number, horaInicial: string): Promise<void> {
    const db = await this.dbPromise;
    const folhaServico = await db.get('folhasServico', id);

    if (!folhaServico) {
        throw new Error('Folha de serviço não encontrada');
    }

    // Atualiza a horaInicial
    folhaServico.horaInicial = horaInicial;

    // Salva a folha de serviço atualizada no IndexedDB
    await db.put('folhasServico', folhaServico);
  }

  // Metodo para finalizar a folha de serviço localmente no IndexedDB
  async finalizarFolhaServicoLocal(id: number, horaFinal: string): Promise<void> {
    const db = await this.dbPromise;
    const folhaServico = await db.get('folhasServico', id);

    if (!folhaServico) {
        throw new Error('Folha de serviço não encontrada');
    }

    // Atualiza a horaFinal
    folhaServico.horaFinal = horaFinal;

    // Salva a folha de serviço atualizada no IndexedDB
    await db.put('folhasServico', folhaServico);
  }

  // Método para salvar a folha de serviço com os IDs das tarefas relacionadas
  async saveFolhaServicoComTarefas(folhaServico: FolhaServico, tarefas: Tarefa[]): Promise<void> {
    const db = await this.dbPromise;

    // Salvar cada tarefa no IndexedDB
    for (const tarefa of tarefas) {
        await db.put('tarefas', tarefa);
    }

    // Criar uma cópia da folha de serviço para salvar no IndexedDB
    const folhaServicoParaSalvar = {
        ...folhaServico,
        tarefas: tarefas.map(tarefa => tarefa.id) // Mapeia as tarefas para seus IDs
    };

    // Salvar a folha de serviço atualizada no IndexedDB com apenas os IDs das tarefas
    await db.put('folhasServico', folhaServicoParaSalvar);
  }
}
