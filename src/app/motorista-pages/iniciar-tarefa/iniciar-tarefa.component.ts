import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { IonHeader, IonTitle, IonMenu, IonToolbar, IonContent, IonButtons, IonMenuButton, IonIcon, IonButton, IonItem, IonList, IonMenuToggle,
  IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonGrid, IonCol, IonRow, IonInput, IonRouterLink, IonApp, IonToast, IonRefresher, IonRefresherContent } from "@ionic/angular/standalone";
import { FolhaServico } from 'src/app/models/folha-servico';
import { Motorista } from 'src/app/models/motorista';
import { FolhaServicoService } from 'src/app/services/folha-servico-service/folha-servico.service';
import { MotoristaService } from 'src/app/services/motorista-service/motorista.service';
import { TarefaService } from 'src/app/services/tarefa-service/tarefa.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-iniciar-tarefa',
  templateUrl: './iniciar-tarefa.component.html',
  styleUrls: ['./iniciar-tarefa.component.scss'],
  imports: [IonRefresherContent, IonRefresher, IonToast, IonApp, IonRouterLink, IonInput, IonRow, IonCol, IonGrid, IonCard, IonCardHeader, IonCardTitle, 
    IonCardContent, IonList, IonItem, IonButton, IonIcon, IonHeader, IonTitle, IonMenu, IonContent, IonToolbar, IonButtons, 
    IonMenuButton, ReactiveFormsModule, RouterLink, CommonModule, RouterOutlet, IonMenuToggle
  ],
  standalone: true
})
export class IniciarTarefaComponent implements OnInit, OnDestroy{  
  
  //Injeções
  fb = inject (FormBuilder);
  motoristaService = inject (MotoristaService);
  folhaServicoService = inject (FolhaServicoService);
  tarefaService = inject (TarefaService);
  router = inject (Router);
  //Formularios
  formGroup: FormGroup;
  //Outros
  email = '';
  motorista: Motorista | null = null; 
  folhaServico: FolhaServico | null = null;
  dataServico: string = this.formatarData(new Date());
  tarefas: any[] = []; // Lista de tarefas
  tarefaAtualIndex = 0; // Índice da tarefa atual
  private timeInterval: any;
  //Mensagens
  showToast = false; // Variável para controlar o Toast
  toastMessage = ''; // Variável para a mensagem do Toast

  constructor() { 
    this.formGroup = this.fb.group({
       //Motorista
       nome: [''],
       matricula: 0,
       //Veiculo
       numeroVeiculo: 0,
       //Folha-Serviço
       id: [''],
       horaInicial: [''],
       horaFinal: [''], 
       //Tarefa
       codTarefa: [''],
       horaInicio: [''],
       horaFim: [''],
       horarioInicio: [''],
       horarioFim: [''],
       evento: [''],

    })
    this.email = localStorage.getItem('email') || ''; 
    //console.log('Email recuperado do localStorage:', this.email);
    this.buscarMotoristaPorEmail();
    setTimeout(() => {
      this.buscarFolha();
    }, 500);
  }  

  buscarMotoristaPorEmail() {
    this.motoristaService.buscarMotoristaPorEmail(this.email).subscribe({
      next: (data) => {
        this.motorista = data; // Armazena o motorista encontrado
        // Preenche os campos do formulário com os dados do motorista
      this.formGroup.patchValue({
        nome: data.nome,
        matricula: data.matricula,
      });
      },
      error: (err) => {
        console.error('Erro ao buscar motorista:', err);
      }
    });
  }

  // Método para formatar a data no formato 'YYYY-MM-DD'
  private formatarData(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Meses começam em 0
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }  

  buscarFolha() {
    if (this.motorista?.matricula !== undefined && this.dataServico) {
      this.folhaServicoService.buscarFolhaServico(this.motorista.matricula, this.dataServico).subscribe(
        (data: FolhaServico) => {
          this.folhaServico = data;
          this.formGroup.patchValue({
            id: data.id,
            horaInicial: data.horaInicial,
            horaFinal: data.horaFinal,
            horarioInicial: data.horarioInicial,
            numeroVeiculo: data.veiculo.numeroVeiculo,
          });
          this.tarefas = data.tarefas || [];
          this.carregarTarefaAtual();
        },
        (error) => {
          console.error('Erro ao buscar folha de serviço:', error);
          this.folhaServico = null; 
        }
      );
    } else {
      console.error('Matricula ou dataServico não estão definidos.');
    }
  }

  carregarTarefaAtual() {
    // Busca a primeira tarefa com 'horaInicio' e 'horaFim' vazios (tarefa ainda não iniciada)
    const tarefaEncontrada = this.tarefas.find(tarefa => !tarefa.horaInicio && !tarefa.horaFim);
    
    if (tarefaEncontrada) {
      this.tarefaAtualIndex = this.tarefas.indexOf(tarefaEncontrada);
      this.formGroup.patchValue({
        codTarefa: tarefaEncontrada.id,
        horarioInicio: tarefaEncontrada.horarioInicio,
        horarioFim: tarefaEncontrada.horarioFim,
        horaInicio: tarefaEncontrada.horaInicio,
        horaFim: tarefaEncontrada.horaFim,
        evento: tarefaEncontrada.evento,
        hodometro: tarefaEncontrada.hodometroInicial,
        catraca: tarefaEncontrada.catracaInicial,
      });
    } else {
      this.router.navigate(['/motorista/iniciar-jornada']);
    }
  }
  
  iniciarEvento() {
    const agora = new Date();
    const horas = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    // Encontra a primeira tarefa não iniciada e não finalizada
    const tarefaAtual = this.tarefas.find(tarefa => !tarefa.horaInicio && !tarefa.horaFim);
    
    if (tarefaAtual) {
      tarefaAtual.horaInicio = horas; // Atualiza localmente o campo horaInicio
      this.formGroup.patchValue({ horaInicio: horas });
  
      // Envia a tarefa atualizada para o backend
      this.tarefaService.iniciarTarefa(tarefaAtual.id, horas).subscribe({
        next: () => {
          console.log(`Tarefa ${tarefaAtual.id} iniciada com sucesso.`);
          this.router.navigate(['/motorista/finalizar-tarefa']);
        },
        error: (error) => {
          console.error('Erro ao iniciar a tarefa:', error);
        }
      });
  
      this.tarefaAtualIndex = this.tarefas.indexOf(tarefaAtual); // Atualiza o índice para a tarefa atual
    } else {
      this.toastMessage = 'Não há mais tarefas disponíveis para iniciar.';
      this.showToast = true;
    }
  }

  ngOnInit() {
    this.updateTime();
  }
  
  formatHoraServidor(hora: string): string {
    return hora.length > 5 ? hora.slice(0, 5) : hora;
  }

  ngOnDestroy() {
    clearInterval(this.timeInterval); // limpa o intervalo ao destruir o componente
  }

  updateTime() {
    this.timeInterval = setInterval(() => {
      const currentTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      this.formGroup.get('horaInicio')?.setValue(currentTime);
    }, 1000); // atualiza a cada segundo
  } 
  
  // Função de refresh
  handleRefresh(event: CustomEvent) {
    this.buscarMotoristaPorEmail();
    this.buscarFolha();
    this.carregarTarefaAtual();
    
    setTimeout(() => {
      // Após carregar os dados, complete o refresher
      event.detail.complete();
    }, 2000);
  } 

}
