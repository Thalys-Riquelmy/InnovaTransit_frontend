import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { IonHeader, IonTitle, IonMenu, IonToolbar, IonContent, IonButtons, IonMenuButton, IonIcon, IonButton, IonItem, IonList, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonGrid, IonCol, IonRow, IonInput, IonRouterLink, IonApp, IonToast } from "@ionic/angular/standalone";
import { FolhaServico } from 'src/app/models/folha-servico';
import { Motorista } from 'src/app/models/motorista';
import { FolhaServicoService } from 'src/app/services/folha-servico-service/folha-servico.service';
import { MotoristaService } from 'src/app/services/motorista-service/motorista.service';

@Component({
  selector: 'app-iniciar-tarefa',
  templateUrl: './iniciar-tarefa.component.html',
  styleUrls: ['./iniciar-tarefa.component.scss'],
  imports: [IonToast, IonApp, IonRouterLink, IonInput, IonRow, IonCol, IonGrid, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonButton, IonIcon, 
    IonHeader, IonTitle, IonMenu, IonContent, IonToolbar, IonButtons, IonMenuButton, ReactiveFormsModule, RouterLink, CommonModule, RouterOutlet
  ],
  standalone: true
})
export class IniciarTarefaComponent {

  //Injeções
  fb = inject (FormBuilder);
  motoristaService = inject (MotoristaService);
  folhaServicoService = inject (FolhaServicoService);
  //Formularios
  formGroup: FormGroup;
  //Outros
  email = '';
  motorista: Motorista | null = null; 
  folhaServico: FolhaServico | null = null;
  dataServico: string = this.formatarData(new Date());
  tarefas: any[] = []; // Lista de tarefas
  tarefaAtualIndex = 0; // Índice da tarefa atual
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
    console.log('Email recuperado do localStorage:', this.email);
    this.buscarMotoristaPorEmail();
    setTimeout(() => {
      console.log('Executando ação após 2 segundos'); 
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
          this.folhaServico = null; // ou algum tratamento adicional
        }
      );
    } else {
      console.error('Matricula ou dataServico não estão definidos.');
      // Aqui você pode adicionar um tratamento para quando a matrícula ou dataServico não estiverem definidos
    }
  }

  carregarTarefaAtual() {
    if (this.tarefaAtualIndex < this.tarefas.length) {
      const tarefaAtual = this.tarefas[this.tarefaAtualIndex];
      this.formGroup.patchValue({
        codTarefa: tarefaAtual.id,
        horarioInicio: tarefaAtual.horarioInicio,
        horarioFim: tarefaAtual.horarioFim,
        horaInicio: tarefaAtual.horaInicio,
        horaFim: tarefaAtual.horaFim,
        evento: tarefaAtual.evento
      });console.log(this.tarefas);
    } else {
      console.log('Todas as tarefas foram processadas.');
    }
  }

  iniciarEvento() {
    const agora = new Date();
    const horas = agora.toLocaleTimeString();
    
    // Verifica se a tarefa atual foi finalizada (se 'horaFim' está preenchido)
    if (this.tarefaAtualIndex < this.tarefas.length) {
      const tarefaAtual = this.tarefas[this.tarefaAtualIndex];

      if (!tarefaAtual.horaFim) { // Se 'horaFim' não está preenchido, exibe um alerta e não permite a próxima tarefa
        this.toastMessage = 'Você precisa finalizar a tarefa atual antes de iniciar uma nova tarefa.';
        this.showToast = true;
        return;
      }

      // Atualiza a tarefa atual com a hora de início
      tarefaAtual.horaInicio = horas;
      this.formGroup.patchValue({ horaInicio: horas });

      console.log('Tarefa atual iniciada:', tarefaAtual);

      // Passa para a próxima tarefa
      this.tarefaAtualIndex++;
      this.carregarTarefaAtual();
    } else {
      console.log('Não há mais tarefas para iniciar.');
    }
  }
}
