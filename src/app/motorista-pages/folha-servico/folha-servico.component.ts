import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { IonHeader, IonTitle, IonMenu, IonToolbar, IonContent, IonButtons, IonMenuButton, IonIcon, IonButton, IonItem, IonList, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonGrid, IonCol, IonRow, IonInput, IonRouterLink, IonApp, IonRouterOutlet } from "@ionic/angular/standalone";
import { FolhaServico } from 'src/app/models/folha-servico';
import { Motorista } from 'src/app/models/motorista';
import { Tarefa } from 'src/app/models/tarefa';
import { AuthService } from 'src/app/services/auth.service';
import { FolhaServicoService } from 'src/app/services/folha-servico-service/folha-servico.service';
import { MotoristaService } from 'src/app/services/motorista-service/motorista.service';

@Component({
  selector: 'app-folha-servico',
  templateUrl: './folha-servico.component.html',
  styleUrls: ['./folha-servico.component.scss'],
  imports: [IonRouterOutlet, IonApp, IonRouterLink, IonInput, IonRow, IonCol, IonGrid, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonButton, IonIcon, 
    IonHeader, IonTitle, IonMenu, IonContent, IonToolbar, IonButtons, IonMenuButton, ReactiveFormsModule, RouterLink, CommonModule, RouterOutlet
  ],
  standalone: true
})
export class FolhaServicoComponent {

  //Injeções
  fb = inject (FormBuilder);
  motoristaService = inject (MotoristaService);
  authService = inject (AuthService);
  folhaServicoService = inject (FolhaServicoService);

  //Formularios
  formGroup: FormGroup;

  //Outros
  motorista: Motorista | null = null; // Corrigido
  folhaServico: FolhaServico | null = null;
  dataServico: string = this.formatarData(new Date());
  listaDeTarefas : Tarefa [] = [];
  email = "";

  constructor() {
    this.formGroup = this.fb.group({
      //Motorista
      nome: [''],
      matricula: [0],
      //Veiculo
      veiculo: ['', [Validators.required]],
      numeroVeiculo: 0,
      hodometro: 0,
      catraca: 0,
      //Folha-Serviço
      id: [''],
      observacao: [''],
      dataServico: [''],
      horaInicial: [''],
      horaFinal: [''],
      horarioInicial: [''],
      horarioFinal: [''],
      finalizada: false,
      //Tarefas
      idTarefa : 0,
      evento: [''],
      horarioFim: [''],
      horarioInicio: [''],
      horaFim: [''],
      horaInicio: [''],
      motivoCancelamento: [''],
      hodometroInicial: [''],
      hodometroFinal: [''],
      catracaInicial: [''],
      catracaFinal: [''],
      cancelado: false,                                          
      //
      folhaServico: [''],
      tarefa: [''],
      codigo: ['']
    });

    // Recupera o email do localStorage e o atribui à variável email
    this.email = localStorage.getItem('email') || ''; // Pega o email ou define como vazio
    console.log('Email recuperado do localStorage:', this.email); // Console log para verificar o email
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
        console.log('Motorista encontrado:', this.motorista);
      },
      error: (err) => {
        console.error('Erro ao buscar motorista:', err);
      }
    });
  }

  navigateToPage1(){}

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
          this.listaDeTarefas = data.tarefas;
          console.log(this.listaDeTarefas)
          this.formGroup.patchValue({
            id: data.id,
            observacao: data.observacao,
            dataServico: data.dataServico,
            horaInicial: data.horaInicial,
            horaFinal: data.horaFinal,
            horarioInicial: data.horarioInicial,
            horarioFinal: data.horarioFinal,
            finalizada: data.finalizada,
            numeroVeiculo: data.veiculo.numeroVeiculo,
            hodometro: data.veiculo.hodometro,
            catraca: data.veiculo.catraca,
          });

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

}