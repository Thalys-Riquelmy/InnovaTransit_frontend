import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { IonHeader, IonTitle, IonMenu, IonToolbar, IonContent, IonButtons, IonMenuButton, IonIcon, IonButton, IonItem, IonList, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonGrid, IonCol, IonRow, IonInput, IonRouterLink, IonApp, IonToast, IonAlert, IonModal, IonRefresherContent, IonRefresher } from "@ionic/angular/standalone";
import { FolhaServico } from 'src/app/models/folha-servico';
import { Motorista } from 'src/app/models/motorista';
import { FolhaServicoService } from 'src/app/services/folha-servico-service/folha-servico.service';
import { MotoristaService } from 'src/app/services/motorista-service/motorista.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { TarefaService } from 'src/app/services/tarefa-service/tarefa.service';


@Component({
  selector: 'app-finalizar-tarefa',
  templateUrl: './finalizar-tarefa.component.html',
  styleUrls: ['./finalizar-tarefa.component.scss'],
  imports: [IonRefresher, IonRefresherContent, IonModal, IonAlert, IonToast, IonApp, IonRouterLink, IonInput, IonRow, IonCol, IonGrid, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonButton, IonIcon, 
    IonHeader, IonTitle, IonMenu, IonContent, IonToolbar, IonButtons, IonMenuButton, ReactiveFormsModule, RouterLink, CommonModule, RouterOutlet
  ],
  standalone: true
})
export class FinalizarTarefaComponent implements OnInit, OnDestroy{

  @ViewChild(IonModal) modal!: IonModal;
  name: string = '';

  private timeInterval: any;

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
       codTarefa: ['', [Validators.required]],
       horaInicio: [''],
       horaFim: ['', [Validators.required]],
       horarioInicio: [''],
       horarioFim: [''],
       evento: [''],
       hodometro: ['', [Validators.required]],
       catraca: ['', [Validators.required]],
       motivoCancelamento: ['']

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
    // Busca a próxima tarefa com 'horaInicio' preenchido e 'horaFim' vazio
    const tarefaEncontrada = this.tarefas.find((tarefa, index) => {
      return tarefa.horaInicio && !tarefa.horaFim;
    });
  
    if (tarefaEncontrada) {
      this.tarefaAtualIndex = this.tarefas.indexOf(tarefaEncontrada); // Atualiza o índice para a tarefa encontrada
      // Carrega a tarefa encontrada
      this.formGroup.patchValue({
        codTarefa: tarefaEncontrada.id,
        horarioInicio: tarefaEncontrada.horarioInicio,
        horarioFim: tarefaEncontrada.horarioFim,
        horaInicio: tarefaEncontrada.horaInicio,
        horaFim: tarefaEncontrada.horaFim,
        evento: tarefaEncontrada.evento,
        hodometro: tarefaEncontrada.hodometro,
        catraca: tarefaEncontrada.catraca,
      });
    } else {
      console.log('Nenhuma tarefa com horaInicio preenchida e horaFim vazia foi encontrada.');
      this.toastMessage = 'Nenhuma tarefa foi inicializada.';
      this.showToast = true;
    }
  }

  finalizarEvento() {
    const agora = new Date();
    const horas = agora.toLocaleTimeString();
  
    // Percorre a lista de tarefas e encontra a primeira tarefa iniciada mas não finalizada
    const tarefaAtual = this.tarefas.find(tarefa => tarefa.horaInicio && !tarefa.horaFim);
  
    if (tarefaAtual) {
      const hodometroFinal = this.formGroup.value.hodometro;
      const catracaFinal = this.formGroup.value.catraca;
  
      // Validação dos campos hodometro, catraca e horaFim
      if (!hodometroFinal || !catracaFinal || !horas) {
        this.toastMessage = 'Hodometro e catraca são campos obrigatórios!';
        this.showToast = true;
        return; // Interrompe a execução se algum campo estiver vazio
      }
  
      tarefaAtual.horaFim = horas;
  
      this.tarefaService.finalizarTarefa(tarefaAtual.id, horas, hodometroFinal, catracaFinal).subscribe({
        next: () => {
          this.router.navigate(['/motorista/iniciar-tarefa']);
          this.toastMessage = 'Tarefa finalizada com sucesso!';
          this.showToast = true;
  
          this.formGroup.patchValue({ horaFim: horas }); // Atualiza o formulário com hora final
          this.tarefaAtualIndex = this.tarefas.indexOf(tarefaAtual) + 1; // Move para a próxima tarefa
        },
        error: (error) => {
          this.toastMessage = 'Erro ao finalizar a tarefa: ' + error.message;
          this.showToast = true;
          console.error('Erro ao finalizar a tarefa:', error);
        }
      });
    } else {
      this.router.navigate(['/motorista/iniciar-jornada']);
    }
  }

  cancelarEvento() {
    const agora = new Date();
    const horas = agora.toLocaleTimeString();
    const motivoCancelamento = this.formGroup.value.motivoCancelamento;
  
    // Verifica se o motivo do cancelamento foi preenchido
    if (!motivoCancelamento || motivoCancelamento.trim() === '') {
      this.toastMessage = 'Para cancelar a tarefa, é necessário preencher o motivo!';
      this.showToast = true;
      return; // Interrompe a execução caso o motivo esteja vazio
    }

    // Busca a tarefa atual (iniciada mas não finalizada)
    const tarefaAtual = this.tarefas.find(tarefa => tarefa.horaInicio && !tarefa.horaFim);
  
    if (tarefaAtual) {
      this.tarefaService.cancelarTarefa(tarefaAtual.id, horas, motivoCancelamento).subscribe({
        next: () => {
          this.toastMessage = 'Tarefa cancelada com sucesso!';
          this.showToast = true;
  
          // Atualiza o formulário e a tarefa atual com o horário de fim do cancelamento
          this.formGroup.patchValue({ horaFim: horas });
          tarefaAtual.horaFim = horas; // Marca a tarefa como finalizada com o horário de cancelamento
  
          // Opção: pode redirecionar ou atualizar a exibição da tarefa
          this.router.navigate(['/motorista/iniciar-tarefa']);
          this.cancel();
        },
        error: (error) => {
          console.error('Erro ao cancelar a tarefa:', error);
        }
      });
    } else {
      this.router.navigate(['/motorista/iniciar-jornada']);
    }
  }
  

  limparCampos(){
    this.formGroup.patchValue({
      hodometro: '',
      catraca: ''
    })
  }

  mudarPaginaTeste(){
    this.router.navigate(['/motorista/iniciar-tarefa']);
    
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
     // this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  ngOnInit() {
    this.updateTime();
  }

  ngOnDestroy() {
    clearInterval(this.timeInterval); // limpa o intervalo ao destruir o componente
  }

  updateTime() {
    this.timeInterval = setInterval(() => {
      const currentTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      this.formGroup.get('horaFim')?.setValue(currentTime);
    }, 1000); // atualiza a cada segundo
  }

  handleRefresh(event: CustomEvent) {
    this.buscarMotoristaPorEmail();
    this.buscarFolha();
    this.carregarTarefaAtual();
    setTimeout(() => {
      // Qualquer chamada de carregamento de dados pode ser colocada aqui
      event.detail.complete();  // Completa a ação de refresh
    }, 2000);
  }  
}
