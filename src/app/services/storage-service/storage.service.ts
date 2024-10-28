import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { InnovaDB } from '../../models/innova-db';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private db: IDBPDatabase<InnovaDB> | null = null;

  constructor() {
    this.openDatabase(); // Abre a base de dados ao inicializar o serviço
  }

  private async openDatabase() {
    this.db = await openDB<InnovaDB>('InnovaDB', 1, {
      upgrade(db) {
        db.createObjectStore('tarefas', {
          keyPath: 'id', // Define o ID como chave primária
          autoIncrement: false // Não gera IDs automaticamente
        });
      }
    });
  }

  async adicionarTarefa(tarefa: {
    id: number; // ID da tarefa, fornecido pelo backend
    horaInicio: string; // Hora de início
    estado: 'pendente'; // Estado da tarefa
    horaFim?: string; // Hora de fim (opcional)
    hodometroFinal?: number; // Hodômetro final (opcional)
    catracaFinal?: number; // Catraca final (opcional)
    motivoCancelamento?: string; // Motivo de cancelamento (opcional)
  }): Promise<number> {
    if (!this.db) await this.openDatabase(); // Verifica se a base de dados está aberta
    await this.db?.add('tarefas', tarefa); // Adiciona a tarefa ao store 'tarefas'
    return tarefa.id; // Retorna o ID da tarefa adicionada
  }

  async obterTodasTarefas(): Promise<InnovaDB['tarefas']['value'][]> {
    if (!this.db) await this.openDatabase(); // Verifica se a base de dados está aberta
    return (await this.db?.getAll('tarefas')) || []; // Retorna todas as tarefas ou um array vazio
  }

  async removerTarefa(id: number): Promise<void> {
    if (!this.db) await this.openDatabase(); // Verifica se a base de dados está aberta
    await this.db?.delete('tarefas', id); // Remove a tarefa com o ID fornecido
  }

  async atualizarTarefa(tarefa: {
    id: number; // ID da tarefa
    horaInicio?: string; // Hora de início (opcional)
    horaFim?: string; // Hora de fim (opcional)
    estado?: 'pendente' | 'concluída'; // Estado da tarefa (opcional)
    hodometroFinal?: number; // Hodômetro final (opcional)
    catracaFinal?: number; // Catraca final (opcional)
    motivoCancelamento?: string; // Motivo de cancelamento (opcional)
  }): Promise<void> {
    if (!this.db) await this.openDatabase(); // Verifica se a base de dados está aberta
    
    // Obtém a tarefa existente
    const tarefaExistente = await this.db?.get('tarefas', tarefa.id);
    
    // Se a tarefa não existir, você pode lançar um erro ou retornar
    if (!tarefaExistente) {
      throw new Error(`Tarefa com ID ${tarefa.id} não encontrada.`);
    }

    // Atualiza apenas os campos que foram passados
    const tarefaAtualizada = {
      ...tarefaExistente, // Mantém os valores existentes
      ...tarefa // Mescla as novas informações
    };

    await this.db?.put('tarefas', tarefaAtualizada); // Atualiza a tarefa no store 'tarefas'
  }
}
