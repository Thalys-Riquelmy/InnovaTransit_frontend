import { DBSchema } from 'idb';

export interface InnovaDB extends DBSchema {
  tarefas: {
    key: number; // Chave primária da tarefa
    value: {
      id: number; // ID da tarefa, fornecido pelo backend
      horaInicio: string; // Hora de início
      horaFim?: string; // Hora de fim (opcional)
      estado: 'pendente' | 'concluída'; // Estado da tarefa
      hodometroFinal?: number; // Hodômetro final (opcional)
      catracaFinal?: number; // Catraca final (opcional)
      motivoCancelamento?: string; // Motivo de cancelamento (opcional)
    };
    indexes: {
      id: number; // Index pelo ID
    };
  };
  jornada: {
    key: number; // Chave primária da jornada
    value: {
      id: number; // ID da jornada
      horaInicial: string; // Hora de início da jornada
      horaFinal?: string; // Hora de fim da jornada (opcional)
      estado: 'pendente' | 'concluída'; // Estado da jornada
    };
    indexes: {
      id: number; // Index pelo ID
    };
  };
}
