import { DBSchema } from 'idb';

export interface InnovaDB extends DBSchema {
  tarefas: {
    key: number; // Chave primária da tarefa
    value: {
      id: number; // ID da tarefa, fornecido pelo backend
      horaInicio: string; // Hora de início
      horaFim?: string; // Hora de fim (opcional)
      hodometroFinal?: number; // Hodômetro final (opcional)
      catracaFinal?: number; // Catraca final (opcional)
      motivoCancelamento?: string; // Motivo de cancelamento (opcional)
    };
    indexes: {
      id: number; // Index pelo ID
    };
  };
  folhaServico: { // Loja para a folha de serviço
    key: number; // Chave primária da folha de serviço
    value: {
      id: number; // ID da folha de serviço
      horaInicial: string; // Hora de início da folha de serviço
      horaFinal?: string; // Hora de fim da folha de serviço (opcional)
      tarefas: number[]; // Array de IDs de tarefas relacionadas
    };
    indexes: {
      id: number; // Index pelo ID
    };
  };
}
