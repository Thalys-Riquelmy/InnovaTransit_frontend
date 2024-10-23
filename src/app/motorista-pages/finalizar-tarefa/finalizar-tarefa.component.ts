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
  selector: 'app-finalizar-tarefa',
  templateUrl: './finalizar-tarefa.component.html',
  styleUrls: ['./finalizar-tarefa.component.scss'],
  imports: [IonToast, IonApp, IonRouterLink, IonInput, IonRow, IonCol, IonGrid, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonButton, IonIcon, 
    IonHeader, IonTitle, IonMenu, IonContent, IonToolbar, IonButtons, IonMenuButton, ReactiveFormsModule, RouterLink, CommonModule, RouterOutlet
  ],
  standalone: true
})
export class FinalizarTarefaComponent {

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
       horarioInicial: [''],
       horarioFinal: [''],
       //Tarefa
       codTarefa: [''],
       horaInicio: [''],
       horaFim: [''],
       horarioInicio: [''],
       horarioFim: [''],
       evento: [''],
       hodometro: [''],
       catraca: ['']

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
      console.log(this.dataServico, this.motorista?.matricula)
      this.folhaServicoService.buscarFolhaServico(this.motorista.matricula, this.dataServico).subscribe(
        (data: FolhaServico) => {
          this.folhaServico = data;
          this.formGroup.patchValue({
            id: data.id,
            horaInicial: data.horaInicial,
            horaFinal: data.horaFinal,
            horarioInicial: data.horarioInicial,
            horarioFinal: data.horarioFinal,
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
        evento: tarefaAtual.evento,
        hodometro: tarefaAtual.hodometro,
        catraca: tarefaAtual.catraca
      });
    } else {
      console.log('Todas as tarefas foram processadas.');
    }
  }

  finalizarEvento() {  
    const agora = new Date();
    const horas = agora.toLocaleTimeString();
    console.log('Data e hora atual:', horas);
    
    // Verifica se há tarefas restantes
    if (this.tarefaAtualIndex < this.tarefas.length) {
      
      const tarefaAtual = this.tarefas[this.tarefaAtualIndex];
      console.log('Tarefa atual:', tarefaAtual);
  
      if (!tarefaAtual.horaInicio) { // Verifica se 'horaInicio' está preenchido
        console.log('Tarefa ainda não foi iniciada.');
        this.toastMessage = 'Você precisa iniciar a tarefa antes de finalizar a nova tarefa.';
        this.showToast = true;
        return;
      }
  
      // Se 'horaInicio' estiver preenchido, atualiza com a 'horaFim'
      tarefaAtual.horaFim = horas;
      this.formGroup.patchValue({ horaFim: horas });
      this.toastMessage = 'Tarefa finalizada com horaFim:', horas;
      this.showToast = true;
      
  
      // Passa para a próxima tarefa
      this.tarefaAtualIndex++;
      console.log('Avançando para a próxima tarefa, índice:', this.tarefaAtualIndex);
  
      if (this.tarefaAtualIndex < this.tarefas.length) {
        this.carregarTarefaAtual(); // Carrega a próxima tarefa
      } else {
        console.log('Todas as tarefas foram finalizadas.');
      }
    } else {
      console.log('Não há mais tarefas para finalizar.');
    }
  }  

  limparCampos(){
    this.formGroup.patchValue({
      hodometro: '',
      catraca: ''
    })
  }

}
