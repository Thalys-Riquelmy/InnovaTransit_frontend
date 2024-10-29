import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { InnovaDB } from '../../models/innova-db';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private db: IDBPDatabase<InnovaDB> | null = null;

  constructor() {
    this.openDatabase().then(() => {
      console.log('Banco de dados InnovaDB inicializado:', this.db);
    }).catch(error => {
      console.error('Erro ao inicializar o banco de dados:', error);
    });
  }

  private async openDatabase() {
    this.db = await openDB<InnovaDB>('InnovaDB', 1, {
      upgrade(db) {
        console.log('Criando objeto store tarefas');
        db.createObjectStore('tarefas', {
          keyPath: 'id',
          autoIncrement: false
        });

        console.log('Criando objeto store jornada');
        db.createObjectStore('jornada', {
          keyPath: 'id',
          autoIncrement: false
        });
      }
    });
    console.log('Banco de dados InnovaDB inicializado:', this.db);
  }

  private async ensureDatabaseOpen() {
    if (!this.db) {
      await this.openDatabase();
    }
  }

  // Métodos para tarefas
  async adicionarTarefa(tarefa: {
    id: number; // ID da tarefa, fornecido pelo backend
    horaInicio: string; // Hora de início
    estado: 'pendente'; // Estado da tarefa
    horaFim?: string; // Hora de fim (opcional)
    hodometroFinal?: number; // Hodômetro final (opcional)
    catracaFinal?: number; // Catraca final (opcional)
    motivoCancelamento?: string; // Motivo de cancelamento (opcional)
  }): Promise<number> {
    await this.ensureDatabaseOpen();
    await this.db?.add('tarefas', tarefa);
    console.log('Tarefa adicionada:', tarefa);
    return tarefa.id;
  }

  async obterTodasTarefas(): Promise<InnovaDB['tarefas']['value'][]> {
    await this.ensureDatabaseOpen();
    const tarefas = await this.db?.getAll('tarefas') || [];
    console.log('Todas as tarefas obtidas:', tarefas);
    return tarefas;
  }

  async removerTarefa(id: number): Promise<void> {
    await this.ensureDatabaseOpen();
    await this.db?.delete('tarefas', id);
    console.log(`Tarefa com ID ${id} removida.`);
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
    await this.ensureDatabaseOpen();

    const tarefaExistente = await this.db?.get('tarefas', tarefa.id);
    if (!tarefaExistente) {
      throw new Error(`Tarefa com ID ${tarefa.id} não encontrada.`);
    }

    const tarefaAtualizada = {
      ...tarefaExistente,
      ...tarefa
    };

    await this.db?.put('tarefas', tarefaAtualizada);
    console.log('Tarefa atualizada:', tarefaAtualizada);
  }

  // Métodos para jornada
  async adicionarJornada(jornada: {
    id: number; // ID da jornada, fornecido pelo backend
    horaInicial: string; // Hora de início da jornada
    estado: 'pendente'; // Estado da jornada
    horaFinal?: string; // Hora de fim da jornada (opcional)
  }): Promise<number> {
    await this.ensureDatabaseOpen();
    await this.db?.add('jornada', jornada);
    console.log('Jornada adicionada:', jornada);
    return jornada.id;
  }

  async obterTodasJornadas(): Promise<InnovaDB['jornada']['value'][]> {
    await this.ensureDatabaseOpen();
    const jornadas = await this.db?.getAll('jornada') || [];
    console.log('Todas as jornadas obtidas:', jornadas);
    return jornadas;
  }

  async removerJornada(id: number): Promise<void> {
    await this.ensureDatabaseOpen();
    await this.db?.delete('jornada', id);
    console.log(`Jornada com ID ${id} removida.`);
  }

  async atualizarJornada(jornada: {
    id: number; // ID da jornada
    horaInicial?: string; // Hora de início (opcional)
    horaFinal?: string; // Hora de fim (opcional)
    estado?: 'pendente' | 'concluída'; // Estado da jornada (opcional)
  }): Promise<void> {
    await this.ensureDatabaseOpen();

    const jornadaExistente = await this.db?.get('jornada', jornada.id);
    if (!jornadaExistente) {
      throw new Error(`Jornada com ID ${jornada.id} não encontrada.`);
    }

    const jornadaAtualizada = {
      ...jornadaExistente,
      ...jornada
    };

    await this.db?.put('jornada', jornadaAtualizada);
    console.log('Jornada atualizada:', jornadaAtualizada);
  }
}
