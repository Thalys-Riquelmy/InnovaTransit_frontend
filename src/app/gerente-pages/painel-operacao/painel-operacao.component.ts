import { CommonModule, formatDate } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { IonTabs, IonTabButton, IonTabBar, IonHeader, IonMenu, IonTitle, IonMenuToggle, IonMenuButton, IonToolbar, IonContent, IonCard, IonSegment, IonSegmentButton, IonLabel, IonCardContent, IonCardHeader, IonCardTitle, IonButton, IonButtons } from "@ionic/angular/standalone";
import { FolhaServico } from 'src/app/models/folha-servico';
import { FolhaServicoService } from 'src/app/services/folha-servico-service/folha-servico.service';

@Component({
  selector: 'app-painel-operacao',
  templateUrl: './painel-operacao.component.html',
  imports: [IonButtons, IonButton, IonCardTitle, IonCardHeader, IonCardContent, RouterOutlet, IonMenuButton, IonLabel, IonMenu, IonMenuToggle, IonSegmentButton, IonSegment, IonCard, IonContent, IonToolbar, CommonModule, IonTitle, IonHeader, IonTabBar, IonTabButton, IonTabs],
  styleUrls: ['./painel-operacao.component.scss'],
  standalone: true
})
export class PainelOperacaoComponent implements OnInit, OnDestroy{

  //Injeções 
  fb = inject (FormBuilder);
  folhaServicoService = inject (FolhaServicoService);

  //Formularios
  //formGroup: FormGroup;

  //Outros
  folhaServico: FolhaServico | null = null;
  listaFolhaServico: FolhaServico [] = [];
  listaFiltrada: FolhaServico [] = [];
  tarefasComHoraInicio: any[] = [];
  tarefasIniciar: any [] = [];
  tarefasFinalizadas: any [] = [];

  currentHour: Date = new Date(); 
  intervalId: any;

  segment: string = 'overview';

  selectedSegment: string = 'veiculos-operando';

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  /*ngOnInit() {
    const dataAtual = new Date(); // Obtém a data atual
    const dataFormatada = formatDate(dataAtual, 'yyyy-MM-dd', 'en-US'); // Formata a data no formato desejado
    this.folhaServicoService.listarFolhaServicoPorData(dataFormatada).subscribe((data) => {
      this.listaFolhaServico = data;
     this.listarTarefasComHoraInicio();
     this.listarTarefasIniciar();
     this.listarTarefasFinalizadas();
    });

    this.intervalId = setInterval(() => {
      this.currentHour = new Date(); 
    }, 1000);
  }*/

    ngOnInit() {
      // Chama o método após 5 segundos (5000 ms)
      setTimeout(() => {
        const dataAtual = new Date(); // Obtém a data atual
        const dataFormatada = formatDate(dataAtual, 'yyyy-MM-dd', 'en-US'); // Formata a data no formato desejado
        this.folhaServicoService.listarFolhaServicoPorData(dataFormatada).subscribe((data) => {
          this.listaFolhaServico = data;
          this.listarTarefasComHoraInicio();
          this.listarTarefasIniciar();
          this.listarTarefasFinalizadas();
        });
      }, 1000); // 5000 ms = 5 segundos
  
      // Intervalo para atualizar a hora atual a cada 1 segundo
      this.intervalId = setInterval(() => {
        this.currentHour = new Date();
      }, 1000);
    }

  listarTarefasComHoraInicio() {
    this.tarefasComHoraInicio = []; // Limpa a lista antes de preencher
  
    this.listaFolhaServico.forEach(folha => {
      // Filtra as tarefas que têm horaInicio preenchido e horaFim nulo
      const tarefasFiltradas = folha.tarefas.filter(tarefa => 
        tarefa.horaInicio != null && tarefa.horaFim == null
      );
  
      // Adiciona as tarefas filtradas na lista de tarefasComHoraInicio com informações do motorista e veículo
      tarefasFiltradas.forEach(tarefa => {
        this.tarefasComHoraInicio.push({
          tarefa,
          motorista: folha.motorista.nome, // Nome do motorista
          veiculo: folha.veiculo?.numeroVeiculo // Modelo do veículo (verifique se a propriedade existe)
        });
      });
    });
  
    console.log("Tarefas com horaInicio preenchida:", this.tarefasComHoraInicio);
  }
  

  listarTarefasIniciar() {
    this.tarefasIniciar = []; // Limpa a lista antes de preencher
  
    this.listaFolhaServico.forEach(folha => {
      // Filtra as tarefas que têm horaInicio e horaFim nulos
      const tarefasFiltradas = folha.tarefas.filter(tarefa => 
        tarefa.horaInicio == null && tarefa.horaFim == null
      );
  
      // Adiciona as tarefas filtradas na lista de tarefasIniciar com informações do motorista e veículo
      tarefasFiltradas.forEach(tarefa => {
        this.tarefasIniciar.push({
          tarefa,
          motorista: folha.motorista.nome, // Nome do motorista
          numeroVeiculo: folha.veiculo?.numeroVeiculo // Número do veículo (verifique se a propriedade existe)
        });
      });
    });
  
    console.log("Tarefas a serem iniciadas:", this.tarefasIniciar);
  }  

  listarTarefasFinalizadas(){
    this.tarefasFinalizadas = [];

    this.listaFolhaServico.forEach(folha => {
      const tarefasFiltradas = folha.tarefas.filter(tarefa => tarefa.horaInicio != null && tarefa.horaFim != null);

      tarefasFiltradas.forEach(tarefa => {
        this.tarefasFinalizadas.push({
          tarefa,
          motorista: folha.motorista.nome,
          motivo: folha.tarefa?.motivoCancelamento,
          cancelado: folha.tarefa?.cancelado,
          numeroVeiculo: folha.veiculo.numeroVeiculo
        });
      });
    });
    console.log("Tarefas Finalizadas", this.tarefasFinalizadas);
  }

  ngOnDestroy() {
    // Limpa o intervalo quando o componente é destruído
    clearInterval(this.intervalId);
  }

  isAtrasado(horarioFim: string | null): boolean {
  
    if (!horarioFim) {
      return false; // Sem previsão de chegada
    }
  
    // Divide o horário previsto em horas e minutos
    const [horasFim, minutosFim] = horarioFim.split(':').map(Number);
    
    // Obtém a hora e os minutos atuais
    const dataAtual = new Date();
    const horasAgora = dataAtual.getHours();
    const minutosAgora = dataAtual.getMinutes();
  
    // Converte o horário fim e atual em minutos para comparação
    const totalMinutosFim = horasFim * 60 + minutosFim;
    const totalMinutosAgora = horasAgora * 60 + minutosAgora;
    // Verifica se a viagem está atrasada
    const atrasado = totalMinutosAgora > totalMinutosFim; // Se for maior, está atrasada
  
    return atrasado;
  }       
  
}
