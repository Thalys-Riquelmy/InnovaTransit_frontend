import { Tarefa } from "./tarefa";
import { Veiculo } from "./veiculo";

export class FolhaServico {
    id = 0; 
    observacao = "";
    dataServico = ""; 
    horaInicial = ""; 
    horaFinal = ""; 
    horarioInicial = "";
    horarioFinal = "";
    finalizada: boolean = false;
    veiculo: Veiculo = new Veiculo();
    tarefas : Tarefa [] = [];
}
